import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

let httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'JWT ' + localStorage.getItem('usertoken')
  })
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {

    uri = environment.apiBase;
    private companyCode = localStorage.getItem('companyCode');
    private companyType = localStorage.getItem('companyType');
    private adminRole = localStorage.getItem('role');
    private agentId = localStorage.getItem('userId');

  constructor(private _http: HttpClient) { }

    getCompanyWallet(from, to) {
        var fromUTC = from;
        var toUTC = to;

        if (this.companyType != "master") {

            let req = {
                agentId: this.agentId,
                from: fromUTC,
                to: toUTC
            }

            console.log(`API Call - admin/getCompanyWalletById/${this.agentId}/${fromUTC}/${toUTC}`);
            return this._http.post<any>(this.uri + 'admin/getCompanyWalletById', req, httpOptions);

        } else {

            console.log(`API Call - admin/getCompanyWallet/${fromUTC}/${toUTC}`);
            return this._http.get<any>(this.uri + 'admin/getCompanyWallet/'+ fromUTC+'/'+toUTC, httpOptions);

        }
        
    }

    getCompanyWalletPagination(from, to) {
        var fromUTC = from
        var toUTC = to
        
        console.log(`API Call - admin/getCompanyWallet/${fromUTC}/${toUTC}`);
        return this._http.get<any>(this.uri + 'admin/getCompanyWallet/'+ fromUTC+'/'+toUTC, httpOptions);
    }

    getMoreData(id, type) {
        return this._http.get<any>(this.uri + 'admin/gettripDataByTripId/'+ id +'/'+ type, httpOptions);
    }
}
