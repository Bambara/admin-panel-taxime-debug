import { Injectable } from '@angular/core';
import { TokenPayload } from '../model/tokenPayload'
import { from, Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    uri = environment.apiBase;
    token: string;
    id: string;

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    private saveToken(token: string): void {
        localStorage.setItem('usertoken', token)
        this.token = token
    }

    private getToken(): string {
        if (!this.token) {
        this.token = localStorage.getItem('usertoken')
        }
        return this.token
    }

    private saveId(id: string): void {
        localStorage.setItem('userId', id)
        this.id = id;
    }

    // private getId(): string {
    //   if (!this.id) {
    //     this.id = localStorage.getItem('userId')
    //   }
    //   return this.id;
    // }

    public getUserDetails() {
        const token = this.getToken()
        let payload
        if (token) {
        return token
        } else {
        return null
        }
    }

    public isLoggedIn(): boolean {
        const user = this.getUserDetails()
        if (user) {
        // return user.exp > Date.now() / 1000
        return true
        } else {
        return false
        }
    }

    public login(user: TokenPayload): Observable<any> {
        
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        }

        const base = this.http.post(this.uri + 'admin/adminlogin', user, httpOptions)

        const request = base.pipe(
            map((data) => {
                if (data['token']) {
                    this.saveToken(data['token']);
                    this.saveId(data['content']['id']);
                    
                    localStorage.setItem('name', data['content'].name);
                    localStorage.setItem('role', data['content'].role);
                    localStorage.setItem('companyCode', data['content'].companyCode);
                    localStorage.setItem('companyName', data['content'].companyName);
                    localStorage.setItem('companyType', data['content'].companyType);
                }
                return data;
            })
        )
        return request
    }

    public logout(): void {
        this.token = ''
        window.localStorage.removeItem('usertoken');
        window.localStorage.removeItem('userId');
        window.localStorage.removeItem('name');
        window.localStorage.removeItem('role');
        window.localStorage.removeItem('companyCode');
        window.localStorage.removeItem('companyName');
        window.localStorage.removeItem('companyType');
        this.router.navigateByUrl('login');
        console.log('logout');
    }
}
