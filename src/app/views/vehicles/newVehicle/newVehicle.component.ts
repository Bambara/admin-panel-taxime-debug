import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleModel } from '../../../shared/model/vehicle.model';
import { DriverModel } from './../../../shared/model/driver.model';
import { vehicleCategoryModel } from '../../../shared/model/vehicleCategory.model';
import { NewVehicleService } from './../../../shared/services/vehicle/new-vehicle.service';
import { DriverService } from './../../../shared/services/driver/driver.service';


@Component({
  selector: 'app-vehicles',
  templateUrl: './newVehicle.component.html',
  styleUrls: ['./newVehicle.component.css']
})
export class NewVehicleComponent implements OnInit {
  vehicle: VehicleModel;
  vehicleCategoryList: vehicleCategoryModel[] = [];
  vehicleSubcategoryList: vehicleCategoryModel[] = [];
  vehicleCategory: any = "";
  vehicleSubcategory: any = "";
  vehicleBookPic: File = null;
  vehicleInsurancePic: File = null;
  vehicleFrontPic: File = null;
  vehicleSideViewPic: File = null;
  vehicleRevenuePic: File = null;
  driverSearching = false;
  driverSearchFailed = false;
  selectedDriver;
  driverList: DriverModel[] = [];


  constructor(
    private router: Router,
    private newVehicleService: NewVehicleService,
    private driverService: DriverService
  ) {
    this.clean();
  }

  ngOnInit() {
    //get Vehicle Category List
    this.newVehicleService.getVehicleCategoryAllData().subscribe(res => {
      this.vehicleCategoryList = res.content;
    });

    //get Driver list
    this.driverService.getEligibleDrivers().subscribe(driver => {
      this.driverList = driver.content;
    });
  }

  addVehicle() {
    if (!this.fetchData()) {
      console.log('form validation faild');
    }
    else {
      let addVehicleFD = new FormData();
      addVehicleFD = this.getAddVehicleFormData();

      this.newVehicleService.addVehicle(addVehicleFD).subscribe(resposn => {
        console.log(resposn);
      });
    }
  }

  fetchData(): boolean {
    this.fetchVehicleCategory();
    this.fetchDriverId();
    this.fetchImagesToUpload();

    if (this.vehicle.vehicleCategoryName == null || this.vehicle.vehicleCategoryName == "") {
      console.log("Vehicle Category Name cannot be empty");
    }
    else if (this.vehicle.vehicleSubcategoryName == null || this.vehicle.vehicleSubcategoryName == "") {
      console.log("Vehicle Subcategory Name cannot be empty");
    }
    else if (this.vehicle.ownerContactName == null || this.vehicle.ownerContactName == "") {
      console.log("Owner Contact Name cannot be empty");
    }
    else if (this.vehicle.ownerContactNumber == null || this.vehicle.ownerContactNumber == "") {
      console.log("Owner Contact Number cannot be empty");
    }
    else if (this.vehicle.ownerContactEmail == null || this.vehicle.ownerContactEmail == "") {
      console.log("Owner Contact Email cannot be empty");
    }
    else if (this.vehicle.address == null || this.vehicle.address == "") {
      console.log("Address cannot be empty");
    }
    else if (this.vehicle.street == null || this.vehicle.street == "") {
      console.log("Street cannot be empty");
    }
    else if (this.vehicle.city == null || this.vehicle.city == "") {
      console.log("City cannot be empty");
    }
    else if (this.vehicle.driverId == null || this.vehicle.driverId == "") {
      console.log("Driver ID cannot be empty");
    }
    else if (this.vehicle.vehicleRevenueNo == null || this.vehicle.vehicleRevenueNo == "") {
      console.log("Vehicle Revenue Number cannot be empty");
    }
    else if (this.vehicle.vehicleRevenueExpiryDate == null) {
      console.log("Vehicle Revenue Expiry Date cannot be empty");
    }
    else if (this.vehicle.vehicleLicenceNo == null || this.vehicle.vehicleLicenceNo == "") {
      console.log("Vehicle Licence Number cannot be empty");
    }
    else if (this.vehicle.vehicleRegistrationNo == null || this.vehicle.vehicleRegistrationNo == "") {
      console.log("Vehicle Registration Number cannot be empty");
    }
    else if (this.vehicle.manufactureYear == null || this.vehicle.manufactureYear == "") {
      console.log("Manufacture Year cannot be empty");
    }
    else if (this.vehicle.vehicleBrandName == null || this.vehicle.vehicleBrandName == "") {
      console.log("Vehicle Brand Name cannot be empty");
    }
    else if (this.vehicle.vehicleBookPic == null) {
      console.log("Vehicle Book Picture Is Mandatory");
    }
    else if (this.vehicle.vehicleInsurancePic == null) {
      console.log("Vehicle Insurance Picture Is Mandatory");
    }
    else if (this.vehicle.vehicleFrontPic == null) {
      console.log("Vehicle Front Picture Is Mandatory");
    }
    else if (this.vehicle.vehicleSideViewPic == null) {
      console.log("Vehicle Side View Picture Is Mandatory");
    }
    else if (this.vehicle.vehicleRevenuePic == null) {
      console.log("Vehicle Revenue Picture Is Mandatory");
    }
    else {
      return true;
    }

    return false;
  }

  getAddVehicleFormData(): FormData {
    let data = new FormData();
    data.append('vehicleCategory', this.vehicle.vehicleCategoryName);
    data.append('subCategoryName', this.vehicle.vehicleSubcategoryName);
    data.append('ownerContactName', this.vehicle.ownerContactName);
    data.append('ownerContactNumber', this.vehicle.ownerContactNumber);
    data.append('ownerContactEmail', this.vehicle.ownerContactEmail);
    data.append('address', this.vehicle.address);
    data.append('street', this.vehicle.street);
    data.append('city', this.vehicle.city);
    data.append('zipcode', this.vehicle.zipcode);
    data.append('country', this.vehicle.country);
    data.append('driverId', this.vehicle.driverId);
    data.append('vehicleRevenueNo', this.vehicle.vehicleRevenueNo);
    var vreDate = (new Date(this.vehicle.vehicleRevenueExpiryDate)).toUTCString();
    data.append('vehicleRevenueExpiryDate', "2018/12/31");
    data.append('vehicleLicenceNo', this.vehicle.vehicleLicenceNo);
    data.append('vehicleRegistrationNo', this.vehicle.vehicleRegistrationNo);
    data.append('vehicleColor', this.vehicle.vehicleColor);
    data.append('manufactureYear', this.vehicle.manufactureYear);
    data.append('vehicleBrandName', this.vehicle.vehicleBrandName);
    data.append('vehicleBookPic', this.vehicle.vehicleBookPic, this.vehicle.vehicleBookPic.name);
    data.append('vehicleInsurancePic', this.vehicle.vehicleInsurancePic, this.vehicle.vehicleInsurancePic.name);
    data.append('vehicleFrontPic', this.vehicle.vehicleFrontPic, this.vehicle.vehicleFrontPic.name);
    data.append('vehicleSideViewPic', this.vehicle.vehicleSideViewPic, this.vehicle.vehicleSideViewPic.name);
    data.append('vehicleRevenuePic', this.vehicle.vehicleRevenuePic, this.vehicle.vehicleRevenuePic.name);

    return data;

  }

  fetchVehicleCategory() {
    this.vehicle.vehicleCategoryName = this.vehicleCategory.categoryName;
    this.vehicle.vehicleSubcategoryName = this.vehicleSubcategory.subCategoryName;
  }

  fetchDriverId() {
    this.vehicle.driverId = this.selectedDriver;
  }

  fetchImagesToUpload() {
    this.vehicle.vehicleBookPic = this.vehicleBookPic;
    this.vehicle.vehicleInsurancePic = this.vehicleInsurancePic;
    this.vehicle.vehicleFrontPic = this.vehicleFrontPic;
    this.vehicle.vehicleSideViewPic = this.vehicleSideViewPic;
    this.vehicle.vehicleRevenuePic = this.vehicleRevenuePic;
  }

  reset() {
    this.router.navigate(['starter']);
  }

  clean() {
    this.vehicle = {
      vehicleCategoryName: "",
      vehicleSubcategoryName: "",
      ownerContactName: "",
      ownerContactNumber: "",
      ownerContactEmail: "",
      address: "",
      street: "",
      city: "",
      zipcode: null,
      country: "",
      driverId: "",
      ownerVerify:"",
      vehicleRevenueNo: "",
      vehicleRevenueExpiryDate: null,
      vehicleLicenceNo: "",
      vehicleRegistrationNo: "",
      vehicleColor: "",
      manufactureYear: "",
      vehicleBrandName: "",
      vehicleBookPic: null,
      vehicleInsurancePic: null,
      vehicleFrontPic: null,
      vehicleSideViewPic: null,
      vehicleRevenuePic: null
    };

    this.vehicleBookPic = null;
    this.vehicleInsurancePic = null;
    this.vehicleFrontPic = null;
    this.vehicleSideViewPic = null;
    this.vehicleRevenuePic = null;
  }

  onFileSelected(event) {
    if (event.target.id == "vehicleBookPic") {
      this.vehicleBookPic = <File>event.target.files[0];
    }
    else if (event.target.id == "vehicleInsurancePic") {
      this.vehicleInsurancePic = <File>event.target.files[0];
    }
    else if (event.target.id == "vehicleFrontPic") {
      this.vehicleFrontPic = <File>event.target.files[0];
    }
    else if (event.target.id == "vehicleSideViewPic") {
      this.vehicleSideViewPic = <File>event.target.files[0];
    }
    else if (event.target.id == "vehicleRevenuePic") {
      this.vehicleRevenuePic = <File>event.target.files[0];
    }
  }

  getSubcategorys(deviceValue) {
    this.vehicleSubcategoryList = deviceValue.subCategory;
  }

}
