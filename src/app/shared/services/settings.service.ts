

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';


const httpOptions = {

};


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  path: string = "";

  public headers = new HttpHeaders();

  constructor(private _http: HttpClient) {
    this.path = environment.apiBase.toString();
  }

  getPath(): string {
    return this.path;
  }


  //############# categories ############

  /**ok */
  addCategory(req): Observable<any> {
    console.log(req);
    console.log("sadfsahfjk");


    let request = {
      categoryObj: req
    }

    console.log(request);


    this.headers.append('Content-Type', 'application/json');

    return this._http.post<any>(`${this.getPath()}vehicleCategory/savecategoryalldata`, request, { headers: this.headers });
  }

    /**ok */
    updateCategory(req, id) {

        console.log('req' , req)

        let request = {
            id : id,
            categoryName: req.categoryName,
            description: req.description,
            isEnable: req.isEnable,
            categoryNo: req.categoryNo
        }
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post<any>(`${this.getPath()}vehicleCategory/updateCategoryData`, request, { headers: this.headers });

    }

  /**ok */
  deleteVehicleCategory(name) {
    let req = {
      categoryName: name
    }
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/deleteCategoryAllData`, req, { headers: this.headers });
  }

  /**ok */
  deleteSubCategory(cat, scat) {
    let req = {
      categoryName: cat,
      subCategoryName: scat
    }
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/deleteSubCategory`, req, { headers: this.headers });
  }

  /**ok */
  addSubCategory(req): Observable<any> {
    console.log(req);


    let request = {
      categoryObj: req
    }


    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post<any>(`${this.getPath()}vehicleCategory/addSubCategory`, request, { headers: this.headers });
  }

  /**ok */
  updateSubCategory(catId, subCatId,cat, sCat, sDes, sEnable, pkgDel,subCategoryNo,tripSendDriversCount,higherBidTripChanceCount,subCategorySkippingCount,driverTripTimerSecoends) {
    let request = {
      subCategoryUpdateObj: {
        categoryName: cat,
        subCategory: {
          subId : subCatId,
          subCategoryName: sCat,
          subDescription: sDes,
          subIsEnable: sEnable,
          packageDelivery: pkgDel,
          subCategoryNo : subCategoryNo,
          tripSendDriversCount :tripSendDriversCount,
          higherBidTripChanceCount :higherBidTripChanceCount,
          subCategorySkippingCount : subCategorySkippingCount,
          driverTripTimerSecoends : driverTripTimerSecoends
        }
      }
    }


    this.headers.append('Content-Type', 'application/json');

    return this._http.post<any>(`${this.getPath()}vehicleCategory/updateSubCategory`, request, { headers: this.headers });

  }

  vehicleCategoryPriceAdd(req) {


    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post<any>(`${this.getPath()}vehicleCategory/vehicleSubCatAddPrSe`, req, { headers: this.headers });

  }

  /**ok */
  getCategory() {
    return this._http.get<any>(`${this.getPath()}vehicleCategory/getCategoryAllData`);
  }

    /* get enbled categories */
    getEnabledCategory() {
        return this._http.get<any>(`${this.getPath()}vehicleCategory/getEnabledCategoryAllData`);
    }

  addSubCatIcons(cat, scat, f1, f2): Observable<any> {

    let request = new FormData();
    request.append("vehicleCategory", cat);
    request.append("subCategoryName", scat);
    request.append("subCategoryIcon", f1);
    request.append("subCategoryIconSelected", f2);

    return this._http.post<any>(`${this.getPath()}vehicleCategory/vehicleCatsubCatIonUp`, request, { headers: this.headers });
  }

  enableCategory(cat, isEnable) {
    let req = {
      categoryName: cat,
      isEnable: isEnable
    }
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/categoryisEnable`, req, { headers: this.headers });
  }//

  enableSubcategory(cat, sCat, isEnable) {
    let req = {
      categoryName: cat,
      subCategoryName: sCat,
      subIsEnable: isEnable
    }
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/subcategoryisEnable`, req, { headers: this.headers });
  }//

  getSubCatIcons(cat, scat) {
    let req = {
      categoryGetIconsObj:
      {
        categoryName: cat,
        subCategory:
        {
          subCategoryName: scat

        }

      }
    }
    return this._http.get<any>(`${this.getPath()}vehicleCategory/vehicleSubCatIcon`);
  }//

  /**ok */
  deleteVehicle(cat, scat, model) {
    let req = {
      categoryName: cat,
      subCategoryName: scat,
      modelType: model
    }
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/deleteVehicle`, req, { headers: this.headers });
  }

  /**ok */
  updateVehicle(cat, sCat, req) {
    let request = {
      categoryName: cat,
      subCategoryName: sCat,
      vehicleBrand: req.vehicleBrand,
      vehicleName: req.vehicleName,
      vehicleClass: req.vehicleClass,
      modelType: req.modelType,
      modelCapacity: req.modelCapacity,
      vehiclePassengerCount: req.vehiclePassengerCount,
      vehicleCapacityWeightLimit: req.vehicleCapacityWeightLimit,
      adminCommission: req.adminCommission,
      companyCommission: req.companyCommission
    }
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/updateVehicle`, request, { headers: this.headers });
  }

  /**ok */
  addVehicleToSubCat(req) {

    let request = {
      vehicle: {
        categoryName: req.categoryName,
        subCategoryName: req.subCategory[0].subCategoryName,
        vehicles: req.subCategory[0].vehicles
      }
    }
    this.headers.append('Content-Type', 'application/json');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/addVehicle`, request, { headers: this.headers });
  }

  deletePriceOfSubCat(cat, scat, dist) {
    let req = {
      categoryName: cat,
      subCategoryName: scat,
      districtName: dist
    }
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/deletePriceSelection`, req, { headers: this.headers });
  }

  addPriceOfSubCat(req) {
    let request = {
      priceSelectionObj: {
        categoryName: req.categoryName,
        subCategoryName: req.subCategory[0].subCategoryName,
        priceSelection: req.subCategory[0].priceSelection
      }
    }
    this.headers.append('Content-Type', 'application/json');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/addPriceSelection`, request, { headers: this.headers });
  }

  updatePriceOfSubCat(cat, scat, req) {
    console.log(req);

    let request = {
      categoryName: cat,
      subCategoryName: scat,
      timeBase : req.timeBase,
      districtName: req.districtName,
      // timeSlotName: req.timeBase[0].timeSlotName,
      // startingTime: req.timeBase[0].startingTime,
      // endingTime: req.timeBase[0].endingTime,
      // districtPrice: req.timeBase[0].districtPrice,
      // aboveKMFare: req.timeBase[0].aboveKMFare,
      // lowerBidLimit: req.timeBase[0].lowerBidLimit,
      // belowKMFare: req.timeBase[0].belowKMFare,
      // baseFare: req.timeBase[0].baseFare,
      // minimumFare: req.timeBase[0].minimumFare,
      // minimumKM: req.timeBase[0].minimumKM,
      // belowAboveKMRange: req.timeBase[0].belowAboveKMRange,
      // trafficWaitingChargePerMinute: req.timeBase[0].trafficWaitingChargePerMinute,
      // normalWaitingChargePerMinute: req.timeBase[0].normalWaitingChargePerMinute,
      // radius: req.timeBase[0].radius,
      // packageDeliveryKMPerHour: req.timeBase[0].packageDeliveryKMPerHour,
      // packageDeliveryKMPerDay: req.timeBase[0].packageDeliveryKMPerDay
    }
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/updatePriceSelection`, request, { headers: this.headers });
  }

  addRdpickupPriceOfSubCat(req) {
    let request = {
      roadPickupPriceSelectionObj: {
        categoryName: req.categoryName,
        subCategoryName: req.subCategory[0].subCategoryName,
        roadPickupPriceSelection: req.subCategory[0].roadPickupPriceSelection
      }
    }
    this.headers.append('Content-Type', 'application/json');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/addRoadPickupPriceSelection`, request, { headers: this.headers });
  }

  updateRdpickupPriceOfSubCat(cat, scat, req) {
    let request = {
      categoryName: cat,
      subCategoryName: scat,
      timeBase : req.timeBase,
      districtName: req.districtName,
      // aboveKMFare: req.timeBase[0].aboveKMFare,
      // belowKMFare: req.timeBase[0].belowKMFare,
      // timeSlotName: req.timeBase[0].timeSlotName,
      // startingTime: req.timeBase[0].startingTime,
      // endingTime: req.timeBase[0].endingTime,
      // districtName: req.districtName,
      // districtPrice: req.timeBase[0].districtPrice,
      // baseFare: req.timeBase[0].baseFare,
      // minimumFare: req.timeBase[0].minimumFare,
      // minimumKM: req.timeBase[0].minimumKM,
      // belowAboveKMRange: req.timeBase[0].belowAboveKMRange,
      // trafficWaitingChargePerMinute: req.timeBase[0].trafficWaitingChargePerMinute,
      // normalWaitingChargePerMinute: req.timeBase[0].normalWaitingChargePerMinute,
      // radius: req.timeBase[0].radius,
      // packageDeliveryKMPerHour: req.timeBase[0].packageDeliveryKMPerHour,
      // packageDeliveryKMPerDay: req.timeBase[0].packageDeliveryKMPerDay
    }
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/updateRoadPickupPriceSelection`, request, { headers: this.headers });
  }

  deleteRoadPickupPrice(cat, scat, dist) {
    let req = {
      categoryName: cat,
      subCategoryName: scat,
      districtName: dist
    }
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/deleteRoadPickupPriceSelection`, req, { headers: this.headers });


  }

  // ################### Upload Images ####################

  imageUploadSubCategory(cat, sCat, image) {

    let req = new FormData();
    req.append("CategoryId", cat);
    req.append("subCategoryId", sCat);
    req.append("subCategoryIcon", image);

    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/categoryImageUpload`, req, { headers: this.headers });
  }

  imageUploadSubCategorySelected(cat, sCat, image) {
    let req = new FormData();
    req.append("CategoryId", cat);
    req.append("subCategoryId", sCat);
    req.append("subCategoryIconSelected", image);

    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/categoryImageUpload`, req, { headers: this.headers });

  }

  imageUploadSubCategoryMapIcon(cat, sCat, image) {
    let req = new FormData();
    req.append("CategoryId", cat);
    req.append("subCategoryId", sCat);
    req.append("mapIcon", image);

    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/categoryImageUpload`, req, { headers: this.headers });

  }

  imageUploadSubCategoryMapIconOffline(cat, sCat, image) {
    let req = new FormData();
    req.append("CategoryId", cat);
    req.append("subCategoryId", sCat);
    req.append("mapIconOffline", image);

    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/categoryImageUpload`, req, { headers: this.headers });

  }

  imageUploadSubCategoryMapIconOntrip(cat, sCat, image) {
    let req = new FormData();
    req.append("CategoryId", cat);
    req.append("subCategoryId", sCat);
    req.append("mapIconOntrip", image);

    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post<any>(`${this.getPath()}vehicleCategory/categoryImageUpload`, req, { headers: this.headers });

  }


}



