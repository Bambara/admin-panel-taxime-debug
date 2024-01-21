import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PendingDriversService } from '../../shared/services/pending-drivers.service';
import { environment } from '../../../environments/environment';
import { Driver } from '../../shared/model/drivers/Drivers';
import { Dispatcher } from '../../shared/model/drivers/Dispatcher';
import { Subject, from } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
import { DriverService } from '../../shared/services/driver/driver.service';


import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-registered-drivers',
  templateUrl: './registered-drivers.component.html',
  styleUrls: ['./registered-drivers.component.css']
})
export class RegisteredDriversComponent implements OnInit {
  roadPickupData: any;
  walletData: any = {};

  today = new Date();
  today1 = new Date();
  from; to;
  noOfRecords: any;

  constructor(
    public pendingDriversService: PendingDriversService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private snotifyService: SnotifyService,
    private driverService: DriverService

  ) {

  }


  //********************************************** */
  config: any;

  pagination(items, pageNo) {

    this.config = {
      itemsPerPage: 10,
      currentPage: pageNo,
      totalItems: items
    };
  }

  pageChanged(event) {
    this.config.currentPage = event;
    console.log(event);
    this.pageNo = event;
    this.getApprovedDriversPagination();

  }
  /*********************************************** */

  ngOnInit() {

    this.today1.setDate(this.today.getDate() + 1);
    this.from = this.today.getFullYear() + '-' + ((this.today.getMonth() + 1) > 9 ? '' : '0') + (this.today.getMonth() + 1) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate();
    this.to = this.today1.getFullYear() + '-' + ((this.today1.getMonth() + 1) > 9 ? '' : '0') + (this.today1.getMonth() + 1) + '-' + (this.today1.getDate() > 9 ? '' : '0') + (this.today1.getDate());

    this.formData();
    this.dispatcherData();
    this.imgApiBase = environment.imgApiBase

    this.attribute = "mobile";
    this.attributeText = "0";
    this.getApprovedDriversPagination();
  }

  registerForm: FormGroup;
  registerForm1: FormGroup;
  submitted = false;
  driveDetails: any;
  driveDetailsExcel: any;

  // hideModel = false;

  public driver: Driver = {
    firstName: null,
    lastName: null,
    email: null,
    nic: null,
    birthday: new Date(),
    mobile: null,
    gender: null,
    address: null,
    street: null,
    city: null,
    zipcode: null,
    country: null,
    nicFrontPic: null,
    nicBackPic: null,
    drivingLicenceFrontPic: null,
    drivingLicenceBackPic: null,
    lifeInsuranceNo: null,
    stringExpiryDate: null,
    driverPic: null,
    lifeInsuranceAmount: null,
    lifeInsuranceExpiryDate: null,
    driverId: null
  };

  public dispatcherId;

  public driverPic = "";
  public drivingLicenceBackPic = "";
  public drivingLicenceFrontPic = "";
  public nicBackPic = "";
  public nicFrontPic = "";

  public update = false;

  isCollapsed: Boolean[] = [];

  imageDriver: string | ArrayBuffer;
  imageNicFrontPic: string | ArrayBuffer;
  imageNicBackPic: string | ArrayBuffer;
  imageDrivingLicenceFrontPic: string | ArrayBuffer;
  imageDrivingLicenceBackPic: string | ArrayBuffer;

  birthday;
  lifeInsuranceExpiryDate;

  isCollapsedRe = true;
  isCollapsedad = true;

  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 5,
    order: [0, 'desc']
  };
  dtTrigger = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  dtTrigger1 = new Subject();
  @ViewChild(DataTableDirective) dtElement1: DataTableDirective;

  i = 0;
  imgApiBase: string;
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

  i1 = 0;
  rerenderTable1(): void {
    if (this.i1 == 0) {
      this.dtTrigger1.next();
      this.i1++;
    }
    else {
      this.dtElement1.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.clear();
        dtInstance.destroy();
        this.dtTrigger1.next();
      });
    }
  }

  isDispatchEnable;
  attributeText;
  attribute;
  pageNo = 1;

  changeCode(id, code) {
    this.driverService.changeCode(id, code)
      .subscribe(data => {
        this.success('success');


      }, error => {
        this.error(error['message']);
      });
  }

  getApprovedDriversPagination() {

    this.driverService.getApprovedDriversPagination(this.from, this.to, this.pageNo, this.attributeText, this.attribute).
      subscribe((response) => {
        this.spinner.show();
        this.driveDetails = response['content'];
        this.noOfRecords = response['noOfRecords'];
        this.pagination(response['noOfRecords'], this.pageNo);

        this.driveDetails.forEach(element => {
          if(!element.driverCode){
            element.driverCode = "";
          }
        });
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.error(error.error['message']);
        this.spinner.hide();
      });
  }

  getDrivers() {
    // this.spinner.show();
    this.pendingDriversService.getApprovedDrivers().subscribe(data => {
      this.driveDetailsExcel = data['content'];
      this.spinner.hide();
      this.exportAsXLSX();

    }, error => {
      console.log(error);
      this.driveDetailsExcel = []

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

    this.driveDetailsExcel.forEach(element => {
      this.excelData.push({
        Name: element.firstName + element.lastName,
        Mobile: element.mobile,
        email: element.email,
        nic: element.nic,
        gender: element.gender,
        company: element.company,
        birthday: element.birthday.split('T')[0],
        address: element.address.address + " , " + element.address.street + " , " + element.address.city,
        lifeInsuranceNo: element.lifeInsuranceNo,
        RegisteredDate: element.recordedTime.split('T')[0] + '  ' + element.recordedTime.split('T')[1].split('Z')[0],
      });
    });

    this.exportAsExcelFile(this.excelData, 'Registered Drivers');
  }
  //***************************************** */

  // create dispatcher Enable 

  assignDispatcher(id) {
    this.dispatcherId = id;
    console.log(this.dispatcherId);

  }

  public dispatcher: Dispatcher = {
    dispatcherType: "Driver",
    dispatcherId: null,
    dispatchPackageType: null,
    dispatcherCommission: null,
    dispatchAdminCommission: null,
    fromDate: null,
    toDate: null
  };

  dispatcherData() {
    this.registerForm1 = this.formBuilder.group({
      dispatcherType: [''],
      dispatcherId: [''],
      dispatchPackageType: [''],
      dispatcherCommission: [''],
      dispatchAdminCommission: [''],
      fromDate: [''],
      toDate: ['']
    });
  }

  dispatchEnable() {
    this.dispatcher.fromDate = this.today.getFullYear() + '-' + ((this.today.getMonth() + 1) > 9 ? '' : '0') + (this.today.getMonth() + 1) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate();
    this.dispatcher.toDate = this.today.getFullYear() + '-' + ((this.today.getMonth() + 1) > 9 ? '' : '0') + (this.today.getMonth() + 1) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate();
    this.dispatcher.dispatcherId = this.dispatcherId,
      console.log(this.dispatcher);
    if (confirm("Are you sure to assign Driver as dispatcher")) {
      this.driverService.createDispatcher(this.dispatcher).subscribe((response) => {
        console.log(response);
        this.success(response['message']);
        this.getApprovedDriversPagination();
      }, error => {
        this.error(error.message)
      });
    }
  }

  viewAttachments(driver) {
    this.driverPic = driver.driverPic;
    this.drivingLicenceBackPic = driver.drivingLicenceBackPic;
    this.drivingLicenceFrontPic = driver.drivingLicenceFrontPic;
    this.nicBackPic = driver.nicBackPic;
    this.nicFrontPic = driver.nicFrontPic;
  }

  openVerticallyCentered(content, driver) {
    this.viewAttachments(driver);
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  enableDriver(id, checked) {

    this.pendingDriversService.enableDriver(id, checked)
      .subscribe(data => {
        this.success(data['message']);
      }
        , error => {
          console.log(error);

        });
  }

  formData() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', Validators.required],
      birthday: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]\d{9}$/)]],
      gender: [''],
      address: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipcode: [''],
      country: [''],
      nicFrontPic: ['', Validators.required],
      nicBackPic: ['', Validators.required],
      drivingLicenceFrontPic: ['', Validators.required],
      drivingLicenceBackPic: ['', Validators.required],
      lifeInsuranceNo: ['', Validators.required],
      lifeInsuranceExpiryDate: ['', Validators.required],
      driverPic: ['', Validators.required],
      lifeInsuranceAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    });
  }

  selectDriverPic(event) {

    if (event.target.files && event.target.files[0]) {
      // this.vehicleCategoryVM.formegory[0].formegoryIconSelected = event.target.files[0];
      const file = event.target.files[0];
      this.driver.driverPic = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageDriver = reader.result;

      reader.readAsDataURL(file);
    }
  }

  selectNicFrontPic(event) {

    if (event.target.files && event.target.files[0]) {
      // this.vehicleCategoryVM.formegory[0].formegoryIconSelected = event.target.files[0];
      const file = event.target.files[0];
      this.driver.nicFrontPic = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageNicFrontPic = reader.result;

      reader.readAsDataURL(file);
    }
  }

  selectNicBackPic(event) {

    if (event.target.files && event.target.files[0]) {
      // this.vehicleCategoryVM.formegory[0].formegoryIconSelected = event.target.files[0];
      const file = event.target.files[0];
      this.driver.nicBackPic = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageNicBackPic = reader.result;

      reader.readAsDataURL(file);
    }
  }

  selectDrivingLicenceFrontPic(event) {

    if (event.target.files && event.target.files[0]) {
      // this.vehicleCategoryVM.formegory[0].formegoryIconSelected = event.target.files[0];
      const file = event.target.files[0];
      this.driver.drivingLicenceFrontPic = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageDrivingLicenceFrontPic = reader.result;

      reader.readAsDataURL(file);
    }
  }

  selectDrivingLicenceBackPic(event) {

    if (event.target.files && event.target.files[0]) {
      // this.vehicleCategoryVM.formegory[0].formegoryIconSelected = event.target.files[0];
      const file = event.target.files[0];
      this.driver.drivingLicenceBackPic = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageDrivingLicenceBackPic = reader.result;

      reader.readAsDataURL(file);
    }
  }

  get validate() {
    return this.registerForm.controls;
  }

  onSubmit() {
    // this.submitted = true;
    console.log(this.registerForm)

    // stop here if form is invalid
    // if (this.registerForm.invalid) {
    //   return;
    // }
    // else {
    if (this.update == false) {
      this.submitted = true;
      if (this.registerForm.invalid) {
        return;
      }

      this.pendingDriversService.driverAdd(this.driver).
        subscribe((response) => {
          this.success(response.message);
          this.registerForm.reset();
          this.submitted = false
          this.getApprovedDriversPagination();
          //this.hideModel = true;
        }, error => {
          // console.log(error);
          this.error(error.error.details);
        });
    }
    else {
      console.log("update: ", this.driver)
      this.pendingDriversService.updateDriver(this.driver).
        subscribe((response) => {
          this.success(response.message);
          this.registerForm.reset();
          this.submitted = false
          this.getApprovedDriversPagination();
          //this.hideModel = true;
        }, error => {
          this.error(error.error.details)
        });
    }
    // }
  }

  modalUpdate() {
    this.update = false;
  }

  feedData(driver, address) {
    this.update = true;
    console.log(driver._id);

    this.driver.driverId = driver._id;
    this.driver.firstName = driver.firstName;
    this.driver.lastName = driver.lastName;
    this.driver.email = driver.email;
    this.driver.nic = driver.nic;
    this.driver.birthday = driver.birthday.split('T')[0];
    this.birthday = driver.birthday.split('T')[0];
    this.driver.mobile = driver.mobile;
    this.driver.gender = driver.gender;

    this.driver.lifeInsuranceNo = driver.lifeInsuranceNo;
    this.driver.lifeInsuranceAmount = driver.lifeInsuranceAmount ? driver.lifeInsuranceAmount : 0;

    this.imageDriver = driver.driverPic;
    this.imageNicFrontPic = driver.nicFrontPic;
    this.imageNicBackPic = driver.nicBackPic;
    this.imageDrivingLicenceFrontPic = driver.drivingLicenceFrontPic;
    this.imageDrivingLicenceBackPic = driver.drivingLicenceBackPic;

    this.driver.address = address.address;
    this.driver.street = address.street;
    this.driver.city = address.city;
    this.driver.zipcode = address.zipcode;
    this.driver.country = address.country;
    this.driver.lifeInsuranceExpiryDate = driver.lifeInsuranceExpiryDate.split('T')[0];
  }

  getRoadpickupData(id) {

    this.roadPickupData = [];

    this.spinner.show();
    this.pendingDriversService.getRoadPickupDataByDriverId(id).subscribe(data => {
      this.roadPickupData = data['content'];

      // this.driveDetails.forEach(element => {
      //   this.isCollapsed.push(false);
      // });
      // this.rerenderTable1();
      this.spinner.hide();

    }, error => {
      // console.log(error);
      // this.driveDetails = []

      this.spinner.hide();
    });
  }

  currentWalletDriverId;

  getwalletData(id) {
    this.walletData = {};
    this.currentWalletDriverId = id;
    this.spinner.show();
    this.pendingDriversService.getwalletData(id).subscribe(data => {
      if (data['content'][0]) {
        this.walletData = data['content'][0];
      }
      else {
        this.walletData = {};
        this.error('Creating Wallet');
        this.createWallet(id);
      }

      this.spinner.hide();

    }, error => {

      this.spinner.hide();
    });
  }

  createWallet(id) {
    this.spinner.show();
    this.pendingDriversService.createWallet(id).subscribe(data => {
      this.getwalletData(id);

      this.spinner.hide();

    }, error => {

      this.spinner.hide();
    });
  }

  rechargeAmount = 0;
  rechargeMethod;
  rechargeDescription;

  updateWalletPoints() {
    this.spinner.show();
    this.pendingDriversService.updateWalletPoints(this.currentWalletDriverId, this.rechargeAmount, this.rechargeMethod, this.rechargeDescription)
      .subscribe(data => {
        this.success('success');
        this.getwalletData(this.currentWalletDriverId);
        this.spinner.hide();

      }, error => {
        this.error(error['message']);
        this.spinner.hide();
      });
  }

  rechargeWallet() {
    this.spinner.show();
    this.pendingDriversService.rechargeWallet(this.currentWalletDriverId, this.rechargeAmount, this.rechargeMethod, this.rechargeDescription)
      .subscribe(data => {
        this.success('success');
        this.getwalletData(this.currentWalletDriverId);
        this.spinner.hide();

      }, error => {
        this.error(error['message']);
        this.spinner.hide();
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

}
