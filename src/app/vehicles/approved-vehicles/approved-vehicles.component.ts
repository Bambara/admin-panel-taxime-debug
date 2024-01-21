import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ApprovedVehicleService } from './../../shared/services/vehicle/approved-vehicle.service';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
import { VehicleModel } from '../../shared/model/vehicle.model';
import { DriverModel } from '../../shared/model/driver.model';
import { vehicleCategoryModel } from '../../shared/model/vehicleCategory.model';
import { NewVehicleService } from '../../shared/services/vehicle/new-vehicle.service';
import { DriverService } from '../../shared/services/driver/driver.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2/dist/sweetalert2.js';


import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-approved-vehicles',
  templateUrl: './approved-vehicles.component.html',
  styleUrls: ['./approved-vehicles.component.css']
})
export class ApprovedVehiclesComponent implements OnInit {
    vehicle: VehicleModel;
    vehicleCategoryList: vehicleCategoryModel[] = [];
    vehicleSubcategoryList: vehicleCategoryModel[] = [];
    vehicleCategory: any = -99;
    vehicleSubcategory: any = -99;
    vehicleBookPic: File = null;
    vehicleInsurancePic: File = null;
    vehicleFrontPic: File = null;
    vehicleSideViewPic: File = null;
    vehicleRevenuePic: File = null;
    driverSearching = false;
    driverSearchFailed = false;
    selectedDriver;
    driverList: DriverModel[] = [];

    addVehicleForm: FormGroup;
    submitted = false;

    public update = false;

    public vehicleBookPic1 = "";
    public vehicleFrontPic1 = "";
    public vehicleInsurancePic1 = "";
    public vehicleRevenuePic1 = "";
    public vehicleSideViewPic1 = "";

    imageBookPic: string | ArrayBuffer;
    imageInsurancePic: string | ArrayBuffer;
    imageSideViewPic: string | ArrayBuffer;
    imageRevenuePic: string | ArrayBuffer;
    imageFrontPic: string | ArrayBuffer;

    today = new Date();
    today1 = new Date();
    from; to;

    dtOptions: DataTables.Settings = {
        pagingType: 'full_numbers',
        pageLength: 5,
        order: [0, 'desc']
    };
    dtTrigger = new Subject();
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;

    // registerForm: FormGroup;
    // submitted = false;
    imgApiBase: string;
    vehicleDetails: any;
    isCollapsed: Boolean[] = [];
    assignedDrivers: any;
    noOfRecords: any;
    vehicleDetailsExcel: any;

    constructor(
        private approvedVehicleService: ApprovedVehicleService,
        private modalService: NgbModal,
        private spinner: NgxSpinnerService,
        private snotifyService: SnotifyService,
        private router: Router,
        private newVehicleService: NewVehicleService,
        private driverService: DriverService,
        private formBuilder: FormBuilder
    ) {
        this.clean();
    }

    //********************************************** */
    config: any;
 
    pagination(items,pageNo) {
        this.config = {
            itemsPerPage: 10,
            currentPage: pageNo,
            totalItems: items
        };
    }
   
    pageChanged(event){
        this.config.currentPage = event;
        console.log(event);
        this.pageNo = event;
        this.getApprovedVahiclesPagination();
    }
    /*********************************************** */

    ngOnInit() {
        this.attribute = "ownerInfo.ownerContactNumber";
        this.attributeText = "0";

        // this.getApprovedVehicles();
        this.getApprovedVahiclesPagination();
        this.imgApiBase = environment.imgApiBase

        //get Vehicle Category List
        this.newVehicleService.getVehicleCategoryAllData().subscribe(res => {
            this.vehicleCategoryList = res.content;
        });

        //get Driver list
        this.driverService.getEligibleDrivers().subscribe(driver => {
            console.log("driverList");
            console.log(driver.content);
            this.driverList = driver.content;
            this.driverList.map((i) => { i.firstName = i.firstName + ' ' + i.lastName; return i; });
        });

        this.today1.setDate(this.today.getDate() + 1);
        this.from = this.today.getFullYear() + '-' + ((this.today.getMonth() + 1) > 9 ? '' : '0') + (this.today.getMonth() + 1) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate();
        this.to = this.today1.getFullYear() + '-' + ((this.today1.getMonth() + 1) > 9 ? '' : '0') + (this.today1.getMonth() + 1) + '-' + (this.today1.getDate() > 9 ? '' : '0') + (this.today1.getDate());

        this.formData();
    }

    i = 0;
    // imgApiBase: string;
    rerenderTable(): void {
        if (this.i == 0) {
            this.dtTrigger.next();
            this.i++;
        }
        else {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.clear();
                dtInstance.destroy();
                this.dtTrigger.next();
            });
        }
    }

    isDispatchEnable;
    attributeText;
    attribute;
    pageNo = 1;

    getApprovedVahiclesPagination() {
        this.spinner.show();
        console.log(this.from, this.to, this.pageNo, this.attributeText, this.attribute);

        this.approvedVehicleService.getapprovedvehiclespagination(this.from, this.to, this.pageNo, this.attributeText, this.attribute).
        subscribe((response) => {
            console.log(response);
            this.vehicleDetails = response['content'];
            this.noOfRecords = response['noOfRecords'];
            this.pagination(response['noOfRecords'],this.pageNo);
            this.spinner.hide();
        }, error => {
            this.spinner.hide();
            console.log(error);
            this.error(error.error['message']);
        });
    }

    getApprovedVehicles() {
        this.spinner.show();

        this.approvedVehicleService.getApprovedVehicles().subscribe(data => {

            this.vehicleDetailsExcel = data['content'];
            this.spinner.hide();
            this.exportAsXLSX();

        }, error => {
            console.log(error);
            this.vehicleDetailsExcel = []
            this.spinner.hide();
        });
    }

    //***************************************** */

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    excelData = [];

    exportAsXLSX(): void {

        this.vehicleDetailsExcel.forEach(element => {
        this.excelData.push({
            VehicleRegistrationNo: element.vehicleRegistrationNo,
            Category: element.vehicleCategory + ' : ' + element.vehicleSubCategory,
            RegisteredDate: element.recordedTime.split('T')[0],
            RegistrationNo: element.vehicleRegistrationNo,
            BrandName: element.vehicleBrandName,
            Manufactureyear: element.manufactureYear,
            Color: element.vehicleColor,
            RevenueNo: element.vehicleRevenueNo,
            OwnerName: element.ownerInfo.ownerContactName,
            OwnerEmail: element.ownerInfo.ownerContactEmail,
            OwnerNumber: element.ownerInfo.ownerContactNumber
        });
        });

        this.exportAsExcelFile(this.excelData, 'Registered Vahicles');
    }
    //***************************************** */


    viewAttachments(vehicle) {
        this.vehicleBookPic1 = vehicle.vehicleBookPic;
        this.vehicleFrontPic1 = vehicle.vehicleFrontPic;
        this.vehicleInsurancePic1 = vehicle.vehicleInsurancePic;
        this.vehicleRevenuePic1 = vehicle.vehicleRevenuePic;
        this.vehicleSideViewPic1 = vehicle.vehicleSideViewPic;
    }

    /* attachement modal */
    attachementView(content, vehicle) {
        this.viewAttachments(vehicle);
        //this.modalService.open(content, { size: 'lg', centered: true });
    }
    
    // openVerticallyCentered(content, vehicle) {
    //     this.viewAttachments(vehicle);
    //     this.modalService.open(content, { size: 'lg', centered: true });
    // }

    /* vehicle enable disable */
    enableVehicle(id, checked) {
        
        console.log("enableVehicle");
        console.log(checked);
        var msg = checked ? 'enable' : 'disable';
        
        Swal.fire({  
            title: 'Are you sure want to '+msg+'?',  
            //text: 'You will not be able to recover this file!',  
            icon: 'warning',  
            showCancelButton: true,  
            cancelButtonText: 'No, keep it', 
            confirmButtonText: 'Yes, '+msg, 
             
        }).then((result) => {  
            if (result.value) {  
                
                this.spinner.show();
                
                this.approvedVehicleService.enableVehicle(id, checked)
                .subscribe(data => {
                    this.spinner.hide();
                    this.success(data['message']);
                    // this.getApprovedVehicles();

                }, error => {
                    // this.error('Error');
                    this.spinner.hide();
                    this.error(error['message'])
                    console.log(error);
                });


            } else if (result.dismiss === Swal.DismissReason.cancel) { 
                this.getApprovedVahiclesPagination(); 
                // Swal.fire(  
                //     'Cancelled',  
                //     'Your imaginary file is safe :)',  
                //     'error'  
                // )  
                // return false;
            }  
        }) 

        
    }

  modalUpdate() {
    this.update = false;
  }

    /* add vehicle */
    addVehicle() {
        this.submitted = true;

        if (this.update == false) {
            if (this.addVehicleForm.invalid) {
                this.error('Fill all reqired fields');
                return;
            }
            else {
                this.fetchData();
                let addVehicleFD = new FormData();
                addVehicleFD = this.getAddVehicleFormData();

                if (this.update == false) {
                    this.newVehicleService.addVehicle(addVehicleFD).subscribe(respons => {
                        console.log(respons);
                        this.success(respons['message']);
                        this.getApprovedVahiclesPagination();

                    }, error => {
                        this.error(error.message)
                    });

                } else {
                // this.newVehicleService.editVehicle(addVehicleFD).subscribe(respons => {
                //   console.log(respons);
                //   this.success(respons['message']);
                //   this.getApprovedVahiclesPagination();

                // }, error => {
                //   this.error(error.message)
                // });
                }
            }
        } else {
            this.fetchData();
            let addVehicleFD = new FormData();
            addVehicleFD = this.getAddVehicleFormData();

            this.newVehicleService.editVehicle(addVehicleFD).subscribe(respons => {
                console.log(respons);
                this.success(respons['message']);
                this.getApprovedVahiclesPagination();

            }, error => {
                this.error(error.message)
            });
        }

    }


  get validate() {
    return this.addVehicleForm.controls;
  }


    formData() {
        this.addVehicleForm = this.formBuilder.group({
            vehicleCategory: ['', Validators.required],
            subCategoryName: ['', Validators.required],
            ownerContactName: ['', Validators.required],
            ownerContactNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            ownerContactEmail: ['', [Validators.required, Validators.email]],
            address: [''],
            street: [''],
            city: [''],
            zipcode: [''],
            country: [''],
            driverId: ['', Validators.required],
            ownerVerify: [''],
            //vehicleRevenueNo: ['', Validators.required],
            //vehicleRevenueExpiryDate: ['', Validators.required],
            //vehicleLicenceNo: ['', Validators.required],
            vehicleRegistrationNo: ['', Validators.required],
            vehicleColor: [''],
            //manufactureYear: ['', Validators.required],
            vehicleBrandName: ['', Validators.required],
            vehicleBookPic: ['', Validators.required],
            vehicleInsurancePic: ['', Validators.required],
            vehicleSideViewPic: ['', Validators.required],
            vehicleRevenuePic: ['', Validators.required],
            vehicleFrontPic: ['', Validators.required],
        });
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
        // else if (this.vehicle.vehicleRevenueNo == null || this.vehicle.vehicleRevenueNo == "") {
        //     console.log("Vehicle Revenue Number cannot be empty");
        // }
        // else if (this.vehicle.vehicleRevenueExpiryDate == null) {
        //     console.log("Vehicle Revenue Expiry Date cannot be empty");
        // }
        // else if (this.vehicle.vehicleLicenceNo == null || this.vehicle.vehicleLicenceNo == "") {
        //     console.log("Vehicle Licence Number cannot be empty");
        // }
        else if (this.vehicle.vehicleRegistrationNo == null || this.vehicle.vehicleRegistrationNo == "") {
            console.log("Vehicle Registration Number cannot be empty");
        }
        // else if (this.vehicle.manufactureYear == null || this.vehicle.manufactureYear == "") {
        //     console.log("Manufacture Year cannot be empty");
        // }
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
    data.append('ownerVerify', this.vehicle.ownerVerify);
    data.append('vehicleRevenueNo', this.vehicle.vehicleRevenueNo);
    var vreDate = (new Date(this.vehicle.vehicleRevenueExpiryDate)).toUTCString();
    data.append('vehicleRevenueExpiryDate', "2018/12/31");
    data.append('vehicleLicenceNo', this.vehicle.vehicleLicenceNo);
    data.append('vehicleRegistrationNo', this.vehicle.vehicleRegistrationNo);
    data.append('vehicleColor', this.vehicle.vehicleColor);
    data.append('manufactureYear', this.vehicle.manufactureYear);
    data.append('vehicleBrandName', this.vehicle.vehicleBrandName);

    if (this.vehicle.vehicleBookPic) {
      data.append('vehicleBookPic', this.vehicle.vehicleBookPic, this.vehicle.vehicleBookPic.name);
    }
    if (this.vehicle.vehicleInsurancePic) {
      data.append('vehicleInsurancePic', this.vehicle.vehicleInsurancePic, this.vehicle.vehicleInsurancePic.name);
    }
    if (this.vehicle.vehicleFrontPic) {
      data.append('vehicleFrontPic', this.vehicle.vehicleFrontPic, this.vehicle.vehicleFrontPic.name);
    }
    if (this.vehicle.vehicleSideViewPic) {
      data.append('vehicleSideViewPic', this.vehicle.vehicleSideViewPic, this.vehicle.vehicleSideViewPic.name);
    }
    if (this.vehicle.vehicleRevenuePic) {
      data.append('vehicleRevenuePic', this.vehicle.vehicleRevenuePic, this.vehicle.vehicleRevenuePic.name);
    }

    data.append('_id', this.id);

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
      ownerVerify: "",
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
      vehicleRevenuePic: null,
      id: ""
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

      const reader = new FileReader();
      reader.onload = e => this.imageBookPic = reader.result;
      reader.readAsDataURL(this.vehicleBookPic);
    }

    else if (event.target.id == "vehicleInsurancePic") {
      this.vehicleInsurancePic = <File>event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageInsurancePic = reader.result;
      reader.readAsDataURL(this.vehicleInsurancePic);
    }

    else if (event.target.id == "vehicleFrontPic") {
      this.vehicleFrontPic = <File>event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageFrontPic = reader.result;
      reader.readAsDataURL(this.vehicleFrontPic);
    }

    else if (event.target.id == "vehicleSideViewPic") {
      this.vehicleSideViewPic = <File>event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSideViewPic = reader.result;
      reader.readAsDataURL(this.vehicleSideViewPic);
    }

    else if (event.target.id == "vehicleRevenuePic") {
      this.vehicleRevenuePic = <File>event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageRevenuePic = reader.result;
      reader.readAsDataURL(this.vehicleRevenuePic);
    }
  }

  getSubcategorys(deviceValue) {
    this.vehicleSubcategoryList = deviceValue.subCategory;
  }

    /* set edit item data */
    id = '';
    
    feedData(vehicle, owner) {

        this.update = true;

        console.log(vehicle);

        this.id = vehicle._id

        console.log(this.id);

        if (vehicle.vehicleCategory) {
            this.vehicleCategory = vehicle.vehicleCategory
        }

        //this.vehicleCategory = vehicle.vehicleCategory

        if (vehicle.vehicleSubCategory) {
            this.vehicleSubcategory = vehicle.vehicleSubCategory
        }
        
        //this.vehicleSubcategory = vehicle.vehicleSubCategory
        

        this.vehicle = vehicle;

        this.vehicle.ownerContactName = owner.ownerContactName;
        this.vehicle.ownerContactNumber = owner.ownerContactNumber;
        this.vehicle.ownerContactEmail = owner.ownerContactEmail;

        if (owner.address) {
            this.vehicle.address = owner.address.address;
            this.vehicle.street = owner.address.street;
            this.vehicle.zipcode = owner.address.zipcode;
            this.vehicle.city = owner.address.city;
            this.vehicle.country = owner.address.country;
        } else {
            this.vehicle.address = "";
            this.vehicle.street = "";
            this.vehicle.zipcode = "";
            this.vehicle.city = "";
            this.vehicle.country = "";
        }   
        

        this.imageBookPic = vehicle.vehicleBookPic;
        this.imageFrontPic = vehicle.vehicleFrontPic;
        this.imageRevenuePic = vehicle.vehicleRevenuePic;
        this.imageInsurancePic = vehicle.vehicleInsurancePic;
        this.imageSideViewPic = vehicle.vehicleSideViewPic;

    }

  driverIdAssignDriver
  vehicleIdAssignDriver

  assignDriver(vehicleId) {

    this.vehicleIdAssignDriver = vehicleId;

    this.approvedVehicleService.assignDriver(this.driverIdAssignDriver, this.vehicleIdAssignDriver).
      subscribe((response) => {
        this.success(response['message']);
        this.getApprovedVahiclesPagination();
      }, error => {
        this.error(error['message'])
      });
  }

  selectedVehicleId;

  getDriversAssignedToVehicle(id) {
    this.selectedVehicleId = id;
    this.approvedVehicleService.getDriversAssignedToVehicle(id).
      subscribe((response) => {
        this.assignedDrivers = response['content']
      }, error => {
        console.error(error['message'])
      });
  }


  enableDriver(id, checked) {

    console.error(id, this.selectedVehicleId);

    this.approvedVehicleService.updateAssignedDriver(id, this.selectedVehicleId, checked)
      .subscribe(data => {
        this.success(data['message']);
        // this.getApprovedVehicles();
      }
        , error => {
          this.error(error.error['message'])
          // this.error('Error');
          console.log(error);
        });
  }


  success(msg) {
    this.snotifyService.success(msg, {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      position: "rightTop"
    })
  }

  error(msg) {
    this.snotifyService.error(msg, {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      position: "rightTop"
    })
  }

  info(msg) {
    this.snotifyService.info(msg, {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      position: "rightTop"
    })
  }

    test(){
        var status = this.confirmBox();
        console.log("ghost swal");
        console.log(status);
    }

    confirmBox(){  
        Swal.fire({  
            title: 'Are you sure want to remove?',  
            text: 'You will not be able to recover this file!',  
            icon: 'warning',  
            showCancelButton: true,  
            confirmButtonText: 'Yes, delete it!',  
            cancelButtonText: 'No, keep it'  
        }).then((result) => {  
            if (result.value) {  
                // Swal.fire(  
                //     'Deleted!',  
                //     'Your imaginary file has been deleted.',  
                //     'success'  
                // )  
                // return true;
            } else if (result.dismiss === Swal.DismissReason.cancel) {  
                // Swal.fire(  
                //     'Cancelled',  
                //     'Your imaginary file is safe :)',  
                //     'error'  
                // )  
                // return false;
            }  
        })  
    } 

    // function confirm(question, text, callback) {
    //     swal({
    //       title: question,
    //       text: text,
    //       buttons: true
    //      }).then((confirmed) => {
    //         if (confirmed) {
    //            callback();
    //          }
    //     });
    // }

    // testConfirm() {
    //     this.showConfirmDialog(["hello ghost", 'Example title']);
    // }

    // /* author : ghost */
    // showConfirmDialog(msg) {
    //     this.snotifyService.confirm(msg, {
    //         timeout: 10000,
    //         showProgressBar: true,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         position: "rightTop",
    //         buttons: [
    //             {text: 'Yes', action: () => console.log('Clicked: Yes'), bold: false},
    //             {text: 'No', action: () => console.log('Clicked: No')},
    //             // {text: 'Later', action: (toast) => {console.log('Clicked: Later'); service.remove(toast.id); } },
    //             //{text: 'Close', action: (toast) => {console.log('Clicked: No'); service.remove(toast.id); }, bold: true},
    //         ]
    //     })
    // }

}


