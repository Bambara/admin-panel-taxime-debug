import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../shared/services/users/users.service';
import { environment } from '../../../environments/environment';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnotifyService } from 'ng-snotify';
import { CorporateUser } from '../../shared/model/cooparate-users/Users'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { from } from 'rxjs';
import { Dispatcher } from '../../shared/model/drivers/Dispatcher';
import { DriverService } from '../../shared/services/driver/driver.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
    selector: 'app-users',
    templateUrl: './app-users.component.html',
    styleUrls: ['./app-users.component.css']
})
export class AppUsersComponent implements OnInit {

    uri = environment.apiBase;
    public addedusers: any;
    registerForm: FormGroup;
    registerForm1: FormGroup;
    submitted = false;
    dispatcherId: any;

    isDispatchEnable;

    today = new Date();
    today1 = new Date();
    from; to;
    noOfRecords: any;

    attributeText;
    attribute;
    pageNo = 1;
    addedusersExcel: any;


    dtOptions: DataTables.Settings = {
        pagingType: 'full_numbers',
        pageLength: 10,
        order : [0, 'desc']
    };

    dtTrigger = new Subject();
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;

    i = 0;
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

    constructor(
        private spinner: NgxSpinnerService,
        private usersService: UsersService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private snotifyService: SnotifyService,
        private driverService: DriverService
    ) { }

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
        this.getAllUserspagination();

    }
    /*********************************************** */


    ngOnInit() {
        // this.addedUsers();
        this.formData();
        this.dispatcherData();
        
        this.attribute = "contactNumber";
        this.attributeText = "0";

        this.today1.setDate(this.today.getDate() + 1);
        this.from = this.today.getFullYear() + '-' + ((this.today.getMonth() + 1) > 9 ? '' : '0') + (this.today.getMonth() + 1) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate();
        this.to = this.today1.getFullYear() + '-' + ((this.today1.getMonth() + 1) > 9 ? '' : '0') + (this.today1.getMonth() + 1) + '-' + (this.today1.getDate() > 9 ? '' : '0') + (this.today1.getDate());

        this.getAllUserspagination();
    }

    getAllUserspagination() {
        
        this.spinner.show();

        this.usersService.getAllUserspagination(this.from, this.to, this.pageNo, this.attributeText, this.attribute).
        subscribe((response) => {
            
            this.addedusers = response['content'];
            console.log(this.addedusers);
            
            //this.noOfRecords = response['noOfRecords'];
            
            //this.pagination(response['noOfRecords'], this.pageNo);
            

            this.rerenderTable();

            this.spinner.hide();

        }, error => {

            console.log(error);
            
            this.error(error['statusText']);
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

    this.addedusersExcel.forEach(element => {
      this.excelData.push({
        UserPlatform: element.userPlatform,
        UserType: element.userType,
        Adress: element.address,
        ContactNumber: element.contactNumber,
        Gender: element.gender,
        Birthday: element.birthday,
        EnableUser: element.enableUser,
      });
    });

    this.exportAsExcelFile(this.excelData, 'App Users');
  }
  //***************************************** */

  addedUsers() {
    this.spinner.show();

    this.usersService.getAllUsers().subscribe((res) => {
      this.addedusersExcel = res['content'];
      this.spinner.hide();
      this.exportAsXLSX();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

//   dtOptions: DataTables.Settings = {
//     pagingType: 'full_numbers',
//     pageLength: 5
//   };

//   dtTrigger = new Subject();
//   @ViewChild(DataTableDirective) dtElement: DataTableDirective;

//   i = 0;
//   rerenderTable(): void {
//     if (this.i == 0) {
//       this.dtTrigger.next();
//       this.i++;
//     }
//     else {
//       this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//         dtInstance.clear();
//         dtInstance.destroy();
//         this.dtTrigger.next();
//       });
//     }
//   }

  public driver: CorporateUser = {
    firstName: null,
    lastName: null,
    mobile: null,
    companyName: null,
    nic: null,
    birthday: null,
    email: null,
    password: null,
    gender: null,
    address: null,
    street: null,
    city: null,
    zipcode: null,
    country: null,
    companyPic: null,
    isEnable: null,
    isApproved: null,
    employeeStrength: null
  };

  public companyPic = "";
  imageCompany: string | ArrayBuffer;

  birthday;
  lifeInsuranceExpiryDate;

  formData() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]\d{9}$/)]],
      comName: [''],
      email: [''],
      password: [''],
      address: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      nic: ['', Validators.required],
      birthday: [''],
      zipcode: [''],
      country: [''],
      companyPic: [''],
      isEnable: [''],
      isApproved: [''],
      isVerified: ['']
    });
  }

  companyPicture(event) {

    if (event.target.files && event.target.files[0]) {
      // this.vehicleCategoryVM.formegory[0].formegoryIconSelected = event.target.files[0];
      const file = event.target.files[0];
      this.driver.companyPic = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageCompany = reader.result;

      reader.readAsDataURL(file);
    }
  }

  enable(checked) {
    console.log('Is Enable')
  }

  approved(checked) {
    console.log('Is Approved')
  }

  verified(checked) {
    console.log('Is Verfied')
  }

  get validate() {
    return this.registerForm.controls;
  }

  onSubmit() {
    console.error(this.driver);
    this.submitted = true;

    // stop here if form is invalid

    if (this.registerForm.invalid) {
      console.log(this.registerForm);
      return;
    }
    else {
      this.usersService.addUser(this.driver).
        subscribe((response) => {
          this.success(response.message);
          this.registerForm.reset();
          this.submitted = false
          this.addedUsers();
          //this.hideModel = true;
        }, error => {
          this.error(error.error.errmsg);

        });
    }

    // this.success('Success !');
    this.registerForm.reset();
  }

  assignDispatcher(id) {
    this.dispatcherId = id;
    console.log(this.dispatcherId);

  }

  public dispatcher: Dispatcher = {
    dispatcherType: "User",
    dispatcherId: null,
    dispatchPackageType: null,
    dispatcherCommission: 0,
    dispatchAdminCommission: 0,
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
        this.addedUsers();
        this.registerForm1.reset();
      }, error => {
        this.error(error.error._message)
      });
    }
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
