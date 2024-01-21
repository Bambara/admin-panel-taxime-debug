import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import 'rxjs/add/observable/of';

let httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + localStorage.getItem('usertoken')
    })
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {

    private apiBase = environment.apiBase;
    private companyCode = localStorage.getItem('companyCode');
    private companyType = localStorage.getItem('companyType');
    private adminRole = localStorage.getItem('role');

    constructor(private httpClient: HttpClient) { }

    getEligibleDrivers() {

        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + localStorage.getItem('usertoken')
            })
        }
        
        if (this.companyType != "master") {
            return this.httpClient.get<any>(this.apiBase + 'driver/geteligibledriversbycompany/'+this.companyCode, httpOptions);
        } else {
            return this.httpClient.get<any>(this.apiBase + 'driver/geteligibledrivers', httpOptions);
        }
    }

    createDispatcher(body) {

        return this.httpClient.post<any>(this.apiBase + 'dispatcher/createdispatcher',body, httpOptions);
    }

    getApprovedDriversPagination(from,to,pageNo,text,param){
        var fromUTC = from
        var toUTC = to
        if (this.companyType != "master") {
            let req = {
                fromDate :fromUTC ,
                toDate : toUTC,
                pageNo : pageNo,
                paginationCount : 10,
                text : text,
                param : param,
                companyCode: this.companyCode,
            }
            return this.httpClient.post(this.apiBase + 'driver/getapproveddriverspaginationbycompany', req, httpOptions);

        } else {

            let req = {
                fromDate :fromUTC ,
                toDate : toUTC,
                pageNo : pageNo,
                paginationCount : 10,
                text : text,
                param : param,
            }
            return this.httpClient.post(this.apiBase + 'driver/getapproveddriverspagination', req, httpOptions);

        }
        
    }

    changeCode(id, code) {
        let req = {
        driverId: id,
        code: code,
        }
        return this.httpClient.post(this.apiBase + 'driver/changeCode', req, httpOptions);
    }

    /* author : ghost */
    getDriverInfoById(id) {
        let req = {
            id: id,
        }
        return this.httpClient.post(this.apiBase + 'admin/getDriverInfoById', req, httpOptions);
    }

    getDriverAllInfoById(id) {
        let req = {
            driverId: id,
        }
        return this.httpClient.post(this.apiBase + 'admin/getDriverAllInfoById', req, httpOptions);
    }

}
