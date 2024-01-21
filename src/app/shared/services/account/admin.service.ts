import { Injectable } from '@angular/core';
import { TokenPayload } from '../../model/tokenPayload'
import { from, Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment'
import { map } from 'rxjs/operators';


let httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + localStorage.getItem('usertoken')
    })
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    uri = environment.apiBase;
    //token: string;
    //id: string;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    headers = new HttpHeaders({
        // 'Content-Type':  'application/json',
        'Authorization': 'JWT ' + localStorage.getItem('usertoken')
    });

    /* admin register */
    registerAdmin(registerData: FormData){
        
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post(this.uri + 'admin/adminRegister', registerData, { headers: this.headers });
    }

    /* admin update */
    updateAdmin(updateData: FormData){
        
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.http.post(this.uri + 'admin/adminUpdateById', updateData, { headers: this.headers });
    }

    /* get admin data by id */
    getAdminInfoById(id) {
        let req = {
            adminId: id
        }
        return this.http.post(this.uri + 'admin/getAdminDataById', req, httpOptions);
    }

    /* get all admins */
    getAllAdminsData() {
        return this.http.get<any>(this.uri + 'admin/getAllAdmins', httpOptions);
    }
    
}