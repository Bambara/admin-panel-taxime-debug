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
export class AgentService {

    uri = environment.apiBase;

    headers = new HttpHeaders({
        // 'Content-Type':  'application/json',
        'Authorization': 'JWT ' + localStorage.getItem('usertoken')
    });

    constructor(
        private router: Router,
        private _http: HttpClient
    ) { }

    getAgents() {
        return this._http.get(this.uri + 'admin/getAgents', httpOptions);
    }

    /* get agent data by id */
    getAgentInfoById(id) {
        let req = {
            agentId: id
        }
        return this._http.post(this.uri + 'admin/getAgentDataById', req, httpOptions);
    }

    /* get agent transaction data by id */
    getAgentTransactionInfoById(id) {
        let req = {
            agentId: id
        }
        return this._http.post(this.uri + 'admin/getAgentTransactionDataById', req, httpOptions);
    }

    /* get agent drivers list */
    getAgentDriversInfoByCode(code) {
        let req = {
            companyCode: code
        }
        return this._http.post(this.uri + 'admin/getAgentDriversDataByCode', req, httpOptions);
    }

    /* rehcharge wallet */
    rechargeWalletById(id, rechargeAmount, rechargeMethod, bonus, rechargeDescription) {
        let req = {
            agentId : id,
            rechargeAmount : rechargeAmount,
            rechargeMethod : rechargeMethod,
            agentBonus : bonus,
            rechargeDescription : rechargeDescription
        }
        return this._http.post(this.uri + 'admin/rechargeAgentWalletById', req, httpOptions);
    }

    approveAgent(id) {
        let req = {
        id: id
        }
        return this._http.post(this.uri + 'admin/approvedriver', req, httpOptions);
    }

    deleteAgent(id) {
        let req = {
        driverId: id
        }
        return this._http.post(this.uri + 'driver/deleteDriver', req, httpOptions);
    }

    registerAgent(registerData: FormData) {

        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.uri + 'admin/agentRegister', registerData, { headers: this.headers });
    }
}
