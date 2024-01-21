import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'JWT ' + localStorage.getItem('usertoken')
  })
}

@Injectable({
  providedIn: 'root'
})
export class DispatcherService {

  constructor(private _http: HttpClient) { }

  uri = environment.apiBase

  getDispatcherspagination(from, to, pageNo, text, param) {
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
    return this._http.post(this.uri + 'dispatcher/getDispatcherspagination', req, httpOptions);
  }

  getDispatchers() {
    return this._http.get<any>(this.uri + 'dispatcher/getdispatchers', httpOptions);
  }

  enableDispatcher(id, checked) {
    let body = {
      id: id,
      isEnable: checked
    }
    return this._http.post<any>(this.uri + 'dispatcher/changestatus', body, httpOptions);
  }

  getwalletData(id) {
    let req = {
      dispatcherId: id
    }
    return this._http.post(this.uri + 'dispatcherWallet/getWallet', req, httpOptions);
  }

  createWallet(id) {
    let req = {
      dispatcherId: id
    }
    return this._http.post(this.uri + 'dispatcherWallet/createwallet', req, httpOptions);
  }


  updateWalletPoints(id, rechargeAmount, rechargeMethod, rechargeDescription) {
    let req = {
      dispatcherId: id,
      rechargeAmount: rechargeAmount,
      rechargeMethod: rechargeMethod,
      rechargeDescription: rechargeDescription
    }
    return this._http.post(this.uri + 'dispatcherWallet/updatewallet', req, httpOptions);
  }

  rechargeWallet(id, rechargeAmount, rechargeMethod, rechargeDescription) {
    let req = {
      dispatcherId: id,
      rechargeAmount: rechargeAmount,
      rechargeMethod: rechargeMethod,
      rechargeDescription: rechargeDescription
    }
    return this._http.post(this.uri + 'dispatcherWallet/rechargewallet', req, httpOptions);
  }

  changeCode(id, code) {
    let req = {
      dispatcherId: id,
      code: code,
    }
    return this._http.post(this.uri + 'dispatcher/changeCode', req, httpOptions);
  }

  changeCommission(id, adminCommission, dispatcherCommisssion, type, from, to) {
    let req = {
      id: id,
      dispatchPackageType: type,
      dispatcherCommission: dispatcherCommisssion,
      dispatchAdminCommission: adminCommission,
      fromDate: from,
      toDate: to
    }
    return this._http.post(this.uri + 'dispatcher/update', req, httpOptions);
  }
}
