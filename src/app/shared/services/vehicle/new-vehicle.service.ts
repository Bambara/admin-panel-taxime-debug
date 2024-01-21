import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';

@Injectable({
  providedIn: 'root'
})
export class NewVehicleService {

    private apiBase = environment.apiBase;
    private companyCode = localStorage.getItem('companyCode');
    private companyType = localStorage.getItem('companyType');
    private adminRole = localStorage.getItem('role');

  headers = new HttpHeaders({
    // 'Content-Type':  'application/json',
    'Authorization': 'JWT ' + localStorage.getItem('usertoken')
  });

  constructor(private httpClient: HttpClient) { }

  getVehicleCategoryAllData() {
    return this.httpClient.get<any>(this.apiBase + "vehicleCategory/getCategoryAllData", { headers: this.headers })
  }

  deleteVehicle(id) {
    let req = {
      id: id
    }
    return this.httpClient.post<any>(this.apiBase + 'vehicle/removevehicle', req, { headers: this.headers });
  }

  //upload data to add vehicle "vehicle/addvehicle"
  addVehicle(vehicle: FormData) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'JWT ' + localStorage.getItem('usertoken')
      })
    }

    return this.httpClient.post(this.apiBase + 'vehicle/addvehicle', vehicle, httpOptions)

      .do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            console.log('Vehicle registered successfully');
          }
          else if (event.status === 203) {
            console.log('Selected driver is not enabled');
          }
          else if (event.status === 206) {
            console.log('not found driver');
          }
          else if (event.status === 208) {
            console.log('vehicle already registered');
          }
          else {
            console.log('Event response code: ' + event.status);
            console.log('Unknown event');
          }
        }
      },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 422) {
              console.log('vehicle images are missing');
            }
            else {
              console.log('Error code: ' + error.status);
              console.log('Unknown error');
            }
          }
        });

  }

  editVehicle(vehicle: FormData) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'JWT ' + localStorage.getItem('usertoken')
      })
    }

    return this.httpClient.post(this.apiBase + 'vehicle/updatevehicle', vehicle, httpOptions)

      .do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            console.log('Vehicle registered successfully');
          }
          else if (event.status === 203) {
            console.log('Selected driver is not enabled');
          }
          else if (event.status === 206) {
            console.log('not found driver');
          }
          else if (event.status === 208) {
            console.log('vehicle already registered');
          }
          else {
            console.log('Event response code: ' + event.status);
            console.log('Unknown event');
          }
        }
      },
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 422) {
              console.log('vehicle images are missing');
            }
            else {
              console.log('Error code: ' + error.status);
              console.log('Unknown error');
            }
          }
        });

  }

    getApprovelVehicles() {

        if (this.companyType != "master") {
            return this.httpClient.get(this.apiBase + 'vehicle/getvehiclestoapprovebycompany/'+this.companyCode, { headers: this.headers });
        } else {
            return this.httpClient.get(this.apiBase + 'vehicle/getvehiclestoapprove', { headers: this.headers });
        }
        
        
    }

  approveVehicle(id){
    let req = {
      id: id
    }
    return this.httpClient.post(this.apiBase + 'vehicle/approvevehicle', req, { headers: this.headers });
  }
}
