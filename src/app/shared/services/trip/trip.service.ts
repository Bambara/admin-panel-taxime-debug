import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'
import { from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'JWT ' + localStorage.getItem('usertoken')
  })
}

@Injectable({
  providedIn: 'root'
})
export class TripService {
  uri = environment.apiBase;

  path: string = "";
  public headers = new HttpHeaders();

  constructor(private _http: HttpClient) {
    this.path = environment.apiBase.toString();
  }

  getCurrentLocationData(lat, lng) {
    return this._http.get<any[]>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapApiKey}`);
  }

  adminadddispatch(dispatch1) {
    // dispatch.pickupTime = dispatch.pickupTime

    // dispatch1.operationRadius = dispatch1.operationRadius * 1000;
    return this._http.post(this.uri + 'dispatch/adminadddispatch', dispatch1, httpOptions);
  }

  getCategory(location,date,time) {

    console.log(location);

    let body = {
      address: localStorage.getItem('origin'),
      latitude: location.lat,
      longitude: location.lng,
      date : date,
      time : time + ':00'
    }
    return this._http.post<any>(this.uri + 'vehicleCategory/getCategoryAllDataTimeAndLocationBased', body, httpOptions);
  }

  getFailedDispatches(from, to) {
    var fromUTC = from
  var toUTC = to
    return this._http.get<any>(this.uri + 'dispatch/getFailedDispatches/'+ fromUTC+'T00:00:00.000Z/'+toUTC+'T00:00:00.000Z', httpOptions);
  }

    getFailedDispatchesPagination(from, to, pageNo, status, category, text) {
        if (text == null) {
            text = 0;
        }
        var fromUTC = from
        var toUTC = to
        
        if (from === undefined && to === undefined) {
            console.log(`API Call - dispatch/getFailedDispatchespagination/${fromUTC}/${toUTC}/${status}/${category}/${pageNo}/${text}`);
            return this._http.get<any>(this.uri + 'dispatch/getFailedDispatchespagination/'+ fromUTC+'/'+toUTC+'/'+status+'/'+category+'/'+ pageNo + '/' + text, httpOptions);
        }

        console.log(`API Call - dispatch/getFailedDispatchespagination/${fromUTC}T00:00:00.000Z/${toUTC}T00:00:00.000Z/${status}/${category}/${pageNo}/${text}`);
        
        return this._http.get<any>(this.uri + 'dispatch/getFailedDispatchespagination/'+ fromUTC+'T00:00:00.000Z/'+toUTC+'T00:00:00.000Z/'+status+'/'+category+'/'+ pageNo + '/' + text, httpOptions);
    }
}
