import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsersService } from '../../shared/services/users/users.service';
import { SnotifyService } from 'ng-snotify';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-manual-customers',
  templateUrl: './manual-customers.component.html',
  styleUrls: ['./manual-customers.component.css']
})
export class ManualCustomersComponent implements OnInit {

  uri = environment.apiBase;
  manualUsers: any;


  today = new Date();
  today1 = new Date();
  from; to;
  noOfRecords: any;

  attributeText;
  attribute;
  pageNo = 1;
  manualUsersExcel: any;

  constructor(
    private spinner: NgxSpinnerService,
    private usersService: UsersService,
    private snotifyService: SnotifyService,
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
    this.getAllManualCustomerspagination();

  }
  /*********************************************** */

  ngOnInit() {
    // this.manualCustomers();
    this.attribute = "mobile";
    this.attributeText = "0";

    this.today1.setDate(this.today.getDate() + 1);
    this.from = this.today.getFullYear() + '-' + ((this.today.getMonth() + 1) > 9 ? '' : '0') + (this.today.getMonth() + 1) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate();
    this.to = this.today1.getFullYear() + '-' + ((this.today1.getMonth() + 1) > 9 ? '' : '0') + (this.today1.getMonth() + 1) + '-' + (this.today1.getDate() > 9 ? '' : '0') + (this.today1.getDate());

    this.getAllManualCustomerspagination();
  }

  getAllManualCustomerspagination() {

    this.usersService.getAllManualCustomerspagination(this.from, this.to, this.pageNo, this.attributeText, this.attribute).
      subscribe((response) => {
        this.spinner.show();
        this.manualUsers = response['content'];
        console.log(this.manualUsers);
        this.noOfRecords = response['noOfRecords'];
        this.pagination(response['noOfRecords'], this.pageNo);
        this.spinner.hide();

      }, error => {

        console.log(error);

        this.error(error['statusText']);
        this.spinner.hide();
      });

  }

  manualCustomers() {
    this.spinner.show();

    this.usersService.getAllManualCustomers().subscribe((res) => {
      this.manualUsersExcel = res['content'];
      this.spinner.hide();
      this.exportAsXLSX()
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 15,
    order: [0, 'desc']
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

    this.manualUsersExcel.forEach(element => {
      this.excelData.push({
        ContactNo: element.mobile,
        Name: element.firstName,
        email: element.email,
      });
    });

    this.exportAsExcelFile(this.excelData, 'General Users');
  }
  //***************************************** */

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
