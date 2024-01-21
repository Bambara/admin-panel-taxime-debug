import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'JWT ' + localStorage.getItem('usertoken')
  })
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  uri = environment.apiBase

  constructor(private _http: HttpClient) { }

  getRoadPickupTrip(from, to) {
    var fromUTC = from
  var toUTC = to
    return this._http.get<any>(this.uri + 'roadPickup/getRoadPickupTrip/'+ fromUTC+'T00:00:00.000Z/'+toUTC+'T00:00:00.000Z', httpOptions);
  }

  getdispatchHistory(from, to) {
    var fromUTC = from
  var toUTC = to
    return this._http.get<any>(this.uri + 'dispatch/getdispatch/'+ fromUTC+'T00:00:00.000Z/'+toUTC+'T00:00:00.000Z', httpOptions);
  }
}
