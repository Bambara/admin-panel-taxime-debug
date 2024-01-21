import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'JWT ' + localStorage.getItem('usertoken')
  })
}

@Injectable({
  providedIn: 'root'
})
export class PendingDriversService {

    uri = environment.apiBase;
    private companyCode = localStorage.getItem('companyCode');
    private companyType = localStorage.getItem('companyType');
    private adminRole = localStorage.getItem('role');

  headers = new HttpHeaders({
    // 'Content-Type':  'application/json',
    'Authorization': 'JWT ' + localStorage.getItem('usertoken')
  });

  constructor(
    private router: Router,
    private _http: HttpClient
  ) { }

    getdriverstoapprove() {
        if (this.companyType != "master") {
            let req = {
                companyCode: this.companyCode,
            }
            return this._http.post(this.uri + 'admin/getdriverstoapprovebycompany', req, httpOptions);
        } else {
            return this._http.get(this.uri + 'admin/getdriverstoapprove', httpOptions);
        }
        
    }

  approveDrivers(id) {
    let req = {
      id: id
    }
    return this._http.post(this.uri + 'admin/approvedriver', req, httpOptions);
  }

  deleteDriver(id) {
    let req = {
      driverId: id
    }
    return this._http.post(this.uri + 'driver/deleteDriver', req, httpOptions);
  }

  getApprovedDrivers() {
    return this._http.get(this.uri + 'driver/getapproveddrivers', httpOptions);
  }

  enableDriver(id, checked) {
    let req = {
      id: id,
      isEnable: checked
    }
    return this._http.post(this.uri + 'driver/enabledriver', req, httpOptions);
  }

  driverAdd(registerForm): Observable<any> {

    let request = new FormData();

    request.append('firstName', registerForm.firstName);
    request.append('lastName', registerForm.lastName);
    request.append('email', registerForm.email);
    request.append('nic', registerForm.nic);
    request.append('birthday', registerForm.birthday);
    request.append('mobile', registerForm.mobile);
    request.append('gender', registerForm.gender);
    request.append('address', registerForm.address);
    request.append('street', registerForm.street);
    request.append('city', registerForm.city);
    request.append('zipcode', registerForm.zipcode);
    request.append('country', registerForm.country);
    request.append('nicFrontPic', registerForm.nicFrontPic);
    request.append('nicBackPic', registerForm.nicBackPic);
    request.append('drivingLicenceFrontPic', registerForm.drivingLicenceFrontPic);
    request.append('drivingLicenceBackPic', registerForm.drivingLicenceBackPic);
    //request.append('lifeInsuranceNo', registerForm.lifeInsuranceNo);
    //request.append('lifeInsuranceExpiryDate', registerForm.lifeInsuranceExpiryDate);
    request.append('driverPic', registerForm.driverPic);
    //request.append('lifeInsuranceAmount', registerForm.lifeInsuranceAmount);


    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // this.headers.append('Authorization' , 'JWT '+localStorage.getItem('usertoken'));
    // return this._http.post(this.uri +'admin/adddriver',registerForm, httpOptions);
    return this._http.post<any>(this.uri + 'admin/adddriver', request, { headers: this.headers });
  }

  updateDriver(registerForm): Observable<any> {

    let request = new FormData();
    console.log(registerForm);
    

    request.append('firstName', registerForm.firstName);
    request.append('lastName', registerForm.lastName);
    request.append('email', registerForm.email);
    request.append('nic', registerForm.nic);
    request.append('birthday', registerForm.birthday);
    request.append('mobile', registerForm.mobile);
    request.append('gender', registerForm.gender);
    request.append('address', registerForm.address);
    request.append('street', registerForm.street);
    request.append('city', registerForm.city);
    request.append('zipcode', registerForm.zipcode);
    request.append('country', registerForm.country);
    request.append('nicFrontPic', registerForm.nicFrontPic);
    request.append('nicBackPic', registerForm.nicBackPic);
    request.append('drivingLicenceFrontPic', registerForm.drivingLicenceFrontPic);
    request.append('drivingLicenceBackPic', registerForm.drivingLicenceBackPic);
    //request.append('lifeInsuranceNo', registerForm.lifeInsuranceNo);
    //request.append('lifeInsuranceExpiryDate', registerForm.lifeInsuranceExpiryDate);
    request.append('driverPic', registerForm.driverPic);
    //request.append('lifeInsuranceAmount', registerForm.lifeInsuranceAmount);
    request.append('driverId', registerForm.driverId);

    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // this.headers.append('Authorization' , 'JWT '+localStorage.getItem('usertoken'));
    // return this._http.post(this.uri +'admin/adddriver',registerForm, httpOptions);
    return this._http.post<any>(this.uri + 'driver/updatedriver', request, { headers: this.headers });
  }

  getRoadPickupDataByDriverId(id){
    let req = {
      driverId : id
    }
    return this._http.post(this.uri + 'roadPickup/getRoadPickupDetailsByDriverId', req, httpOptions);
  }

    getwalletData(id){
        let req = {
            driverId : id
        }
        return this._http.post(this.uri + 'driverWallet/getWallet', req, httpOptions);
    }

    createWallet(id){
        let req = {
            driverId : id
        }
        return this._http.post(this.uri + 'driverWallet/createwallet', req, httpOptions);
    }


  updateWalletPoints(id, rechargeAmount,rechargeMethod,rechargeDescription){
    let req = {
      driverId : id,
      rechargeAmount : rechargeAmount,
      rechargeMethod : rechargeMethod,
      rechargeDescription : rechargeDescription
    }
    return this._http.post(this.uri + 'driverWallet/updatewallet', req, httpOptions);
  }

    rechargeWallet(id, rechargeAmount,rechargeMethod,rechargeDescription){

        if (this.companyType != "master") {
            let req = {
                driverId : id,
                rechargeAmount : rechargeAmount,
                rechargeMethod : rechargeMethod,
                rechargeDescription : rechargeDescription,
                companyCode : this.companyCode
            }
            return this._http.post(this.uri + 'driverWallet/rechargewalletbydrivercompany', req, httpOptions);

        } else {

            let req = {
                driverId : id,
                rechargeAmount : rechargeAmount,
                rechargeMethod : rechargeMethod,
                rechargeDescription : rechargeDescription
            }
            return this._http.post(this.uri + 'driverWallet/rechargewallet', req, httpOptions);

        }
        
    }
}
