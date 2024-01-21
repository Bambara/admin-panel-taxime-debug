import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Headers } from '@angular/http';

let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'JWT ' + localStorage.getItem('usertoken')
  })
}

@Injectable({
  providedIn: 'root'
})
export class ApprovedVehicleService {
    
    uri = environment.apiBase;
    private companyCode = localStorage.getItem('companyCode');
    private companyType = localStorage.getItem('companyType');
    private adminRole = localStorage.getItem('role');

  headers = new HttpHeaders({
    // 'Content-Type':  'application/json',
    'Authorization': 'JWT ' + localStorage.getItem('usertoken')
  });

  constructor(private httpClient: HttpClient) { }

    getapprovedvehiclespagination(from, to, pageNo, text, param) {
        var fromUTC = from
        var toUTC = to

        if (this.companyType != "master") {

            let req = {
                fromDate: fromUTC,
                toDate: toUTC,
                pageNo: pageNo,
                paginationCount: 10,
                text: text,
                param: param,
                companyCode: this.companyCode,
            }
            return this.httpClient.post(this.uri + 'vehicle/getapprovedvehiclespaginationbycompany', req, httpOptions);

        } else {

            let req = {
                fromDate: fromUTC,
                toDate: toUTC,
                pageNo: pageNo,
                paginationCount: 10,
                text: text,
                param: param
            }
            return this.httpClient.post(this.uri + 'vehicle/getapprovedvehiclespagination', req, httpOptions);

        }
    }

  getApprovedVehicles() {
    return this.httpClient.get(this.uri + 'vehicle/getapprovedvehicles', { headers: this.headers });
  }

  enableVehicle(id, checked) {
    let req = {
      id: id,
      isEnable: checked
    }
    return this.httpClient.post(this.uri + 'vehicle/enablevehicle', req, httpOptions);
  }

  assignDriver(driver, vehicle) {

    let body = {
      _id: vehicle,
      driverInfo: [
        {
          driverId: driver
        }
      ]
    }

    console.log(body);
    return this.httpClient.post(this.uri + 'vehicle/adddrivers', body, httpOptions);
  }

  getDriversAssignedToVehicle(vehicleId) {

    let body =
    {
      vehicleId: vehicleId
    }

    console.log(body);
    return this.httpClient.post(this.uri + 'vehicle/managedrivers', body, httpOptions);
  }

  updateAssignedDriver(driver, vehicle, val) {

    let body =
    {
      vehicleId: vehicle,
      driverId: driver,
      isEnableDriver: val
    }

    return this.httpClient.post(this.uri + 'vehicle/changevehicledriver', body, httpOptions);
  }

}
