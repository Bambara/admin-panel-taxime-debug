import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Role } from '../../enums/role.enum';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + localStorage.getItem('usertoken')
    })
  }

    private apiBase = environment.apiBase;
    private companyCode = localStorage.getItem('companyCode');
    private companyType = localStorage.getItem('companyType');
    private adminRole = localStorage.getItem('role');
    roleEnum = Role;


  constructor(private httpClient: HttpClient) { }


  getVehicleTracking(){
    return this.httpClient.get(this.apiBase + 'admin/getVehicleTracking');
  }

  refresh(){
    return this.httpClient.delete(this.apiBase + 'admin/cleartrackings');
  }

  getDistance(orilng, orilat, deslng, deslat){
    return this.httpClient.get('https://maps.googleapis.com/maps/api/distancematrix/json?origins='+ orilat+ ','+orilng+'&destinations='+deslat+ ','+deslng+'&key=' + environment.googleMapApiKey);
      //  return this.httpClient.get<any[]>(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=7.093542999999999,79.9937033999996&destinations=6.9336686,79.85004700000002&key=AIzaSyAZPcxlwexVBUDpBX6OgenSBIH3IteLD6A`);
    // return this.httpClient.get<any[]>(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=7.093542999999999,79.9937033999996&destinations=6.9336686,79.85004700000002&key=${environment.googleMapApiKey}`);
  // return this.httpClient.jsonp<any[]>(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Washington,DC&destinations=New+York+City,NY&key=AIzaSyAZPcxlwexVBUDpBX6OgenSBIH3IteLD6A`, 'JSONP_CALLBACK') 
  // return this.ng s.get<any[]>(`https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood&key=${environment.googleMapApiKey}`);
}

getManualCustomers(text){
  return this.httpClient.get(this.apiBase + `admin/getAllManualCustomers/${text}`);
}

getDashboardData(from, to){
    var fromUTC = from
    var toUTC = to
    
    console.log(`API Call - admin/getDashboardData/${fromUTC}/${toUTC}`);
    // console.log(fromUTC.getUTCMonth())
    // console.log(fromUTC.getUTCFullYear())
    // console.log(fromUTC.getUTCHours())
    // console.log(fromUTC.getUTCMinutes())

    if (this.companyType != "master") {
        return this.httpClient.get(this.apiBase + `admin/getDashboardDataByCompany/${fromUTC}/${toUTC}/${this.companyCode}`);
    } else {
        return this.httpClient.get(this.apiBase + `admin/getDashboardData/${fromUTC}/${toUTC}`);
    }
    
    
}

}
