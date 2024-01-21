import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CooparateUsersService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + localStorage.getItem('usertoken')
    })
  }

  private apiBase = environment.apiBase;

  constructor(private httpClient: HttpClient) { }

  addCorporateUser(corporateUser) {

    let data = new FormData();
    data.append('firstName', corporateUser.firstName);
    data.append('lastName', corporateUser.lastName);
    data.append('mobile', corporateUser.mobile);
    data.append('companyName', corporateUser.companyName);
    data.append('email', corporateUser.email);
    data.append('password', corporateUser.password);
    data.append('gender', corporateUser.gender);
    data.append('address', corporateUser.address);
    data.append('street', corporateUser.street);
    data.append('city', corporateUser.city);
    data.append('zipcode', corporateUser.zipcode);
    data.append('country', corporateUser.country);
    data.append('company', corporateUser.company);
    data.append('isEnable', corporateUser.isEnable);
    data.append('isApproved', corporateUser.isApproved);
    data.append('employeeStrength', corporateUser.employeeStrength);
    data.append('companyPic', corporateUser.companyPic);

    return this.httpClient.post<any>(this.apiBase + 'corporateUser/corporateUserAddByAdmin',data);
  }


  getCorporateUsers(){
    return this.httpClient.get(this.apiBase + 'corporateUser/getCorporateUsers');
  }

}
