import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT ' + localStorage.getItem('usertoken')
    })
  }

  private apiBase = environment.apiBase;

  constructor(private httpClient: HttpClient) { }

  getAllUserspagination(from, to, pageNo, text, param) {
    var fromUTC = from
  var toUTC = to
    let req = {
      fromDate: fromUTC,
      toDate: toUTC,
      pageNo: pageNo,
      paginationCount: 10,
      text: text,
      param: param
    }
    return this.httpClient.post(this.apiBase + 'admin/getAllUserspagination', req, this.httpOptions);
  }

  getAllManualCustomerspagination(from, to, pageNo, text, param) {
    var fromUTC = from
  var toUTC = to
    let req = {
      fromDate: fromUTC,
      toDate: toUTC,
      pageNo: pageNo,
      paginationCount: 10,
      text: text,
      param: param
    }
    return this.httpClient.post(this.apiBase + 'admin/getAllManualCustomerspagination', req, this.httpOptions);
  }

  getAllUsers() {
    return this.httpClient.get<any>(this.apiBase + 'admin/getAllUsers', this.httpOptions);
  }

  addUser(driver) {
    return this.httpClient.post<any>(this.apiBase + 'admin/addUser', driver ,this.httpOptions);
  }

  getAllManualCustomers() {
    return this.httpClient.get<any>(this.apiBase + 'admin/getAllManualCustomers/0', this.httpOptions);
  }

}
