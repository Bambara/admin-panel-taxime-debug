import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class GetCategoryService {

  uri = environment.apiBase

  constructor(private _http: HttpClient) { }

  getCategory() {
    return this._http.get<any>(this.uri + 'vehicleCategory/getCategoryAllData');
  }
}
