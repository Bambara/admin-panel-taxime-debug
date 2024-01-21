import { Injectable } from '@angular/core';
import { LoginService } from '../services/login.service'
import { Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
    // console.log(!this.loginService.isLoggedIn())
    console.warn(route.data);
    const role = localStorage.getItem('role');
    var match = false;

    if(!localStorage.getItem('role')){
      localStorage.clear();
    }    

    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['/login'])
      return false
    }
    else {

      route.data.expectedRole.forEach(element => {
        if(element == role){
          match = true;
        }
      });

      if(match){
        return true;
      }
      else{
        alert('You do not have permission');
        return false;
      }
    }
  }
}
