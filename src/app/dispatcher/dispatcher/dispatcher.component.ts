import { Component, OnInit, ViewChild } from '@angular/core';
import { DispatcherService } from '../../shared/services/dispatcher/dispatcher.service';
import { environment } from '../../../environments/environment';
import { from, Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
import { DataTableDirective } from 'angular-datatables';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-dispatcher',
  templateUrl: './dispatcher.component.html',
  styleUrls: ['./dispatcher.component.css']
})
export class DispatcherComponent implements OnInit {
  walletData: any = {};
  detailsExcel: any;

  constructor(
    private dispatcherService: DispatcherService,
    private spinner: NgxSpinnerService,
    private snotifyService: SnotifyService,
  ) { }

  details: any;

  isCollapsedRe = true;
  isCollapsedad = true;

  today = new Date();
  today1 = new Date();
  from; to;
  noOfRecords: any;

  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 5,
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
    this.getDispatcherspagination();

  }
  /*********************************************** */

  ngOnInit() {

    this.attribute = "type";
    this.attributeText = "Driver";

    // this.getDispatchers();
    this.getDispatcherspagination();
    this.imgApiBase = environment.imgApiBase

    this.today1.setDate(this.today.getDate() + 1);
    this.from = this.today.getFullYear() + '-' + ((this.today.getMonth() + 1) > 9 ? '' : '0') + (this.today.getMonth() + 1) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate();
    this.to = this.today1.getFullYear() + '-' + ((this.today1.getMonth() + 1) > 9 ? '' : '0') + (this.today1.getMonth() + 1) + '-' + (this.today1.getDate() > 9 ? '' : '0') + (this.today1.getDate());

  }


  imgApiBase: string;

  isDispatchEnable;
  attributeText;
  attribute;
  pageNo = 1;

  getDispatcherspagination() {
    console.log(this.from, this.to, this.pageNo, this.attributeText, this.attribute);

    this.dispatcherService.getDispatcherspagination(this.from, this.to, this.pageNo, this.attributeText, this.attribute).
      subscribe((response) => {
        this.spinner.show();
        this.details = response['content'];
        console.log(this.details);
        
        this.noOfRecords = response['noOfRecords'];
          this.pagination(response['noOfRecords'],this.pageNo);
        this.spinner.hide();

      }, error => {

        console.log(error);
        this.error(error.error['message']);
        this.spinner.hide();
      });
  }

  getDispatchers() {
    this.spinner.show();

    this.dispatcherService.getDispatchers().subscribe(data => {
      this.spinner.hide();
      // console.log(data); 
      this.detailsExcel = data['content']
      this.exportAsXLSX();

    }, error => {
      console.log(error);
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
    
    this.detailsExcel.forEach(element => {
      if (element.dispatcherId == null) {
        
        this.excelData.push({
          // FirstName: element.dispatcherId.firstName,
          // LastName: element.dispatcherId.lastName,
          // Mobile: element.dispatcherId.mobile,
          Type: element.type,
          DispatchPackageType: element.dispatchPackageType,
          DispatcherCode: element.dispatcherCode,
          // Email: element.dispatcherId.email,
          // NIC: element.dispatcherId.nic,
          // Birthday: element.dispatcherId.birthday,
          // Gender: element.dispatcherId.gender,
          RecordedTime: element.recordedTime
        });

      }else{
        if (element.type == 'Driver') {
          
          this.excelData.push({
            FirstName: element.dispatcherId.firstName,
            LastName: element.dispatcherId.lastName,
            Mobile: element.dispatcherId.mobile,
            Type: element.type,
            DispatchPackageType: element.dispatchPackageType,
            DispatcherCode: element.dispatcherCode,
            Email: element.dispatcherId.email,
            NIC: element.dispatcherId.nic,
            Birthday: element.dispatcherId.birthday,
            Gender: element.dispatcherId.gender,
            RecordedTime: element.recordedTime
          });

        } else {

          this.excelData.push({
            FirstName: element.dispatcherId.name,
            Mobile: element.dispatcherId.contactNumber,
            Type: element.type,
            DispatchPackageType: element.dispatchPackageType,
            DispatcherCode: element.dispatcherCode,
            Email: element.dispatcherId.email,
            NIC: element.dispatcherId.nic,
            Birthday: element.dispatcherId.birthday,
            Gender: element.dispatcherId.gender,
            RecordedTime: element.recordedTime
          });
          
        }
      }

    });

    this.exportAsExcelFile(this.excelData, 'Dispatcher Users');
  }
  //***************************************** */


  enableDispatcher(id, checked) {
    console.log(id, checked);
    this.dispatcherService.enableDispatcher(id, checked)
      .subscribe(data => {
        this.success(data['message']);
      }
        , error => {
          console.log(error);
          this.error(error);

        });
  }

  currentWalletDispatcherId;

  getwalletData(id) {
    this.walletData = {};
    this.currentWalletDispatcherId = id;
    this.spinner.show();
    this.dispatcherService.getwalletData(id).subscribe(data => {
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
    this.dispatcherService.createWallet(id).subscribe(data => {
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
    this.dispatcherService.updateWalletPoints(this.currentWalletDispatcherId, this.rechargeAmount, this.rechargeMethod, this.rechargeDescription)
      .subscribe(data => {
        this.success('success');
        this.getwalletData(this.currentWalletDispatcherId);
        this.spinner.hide();

      }, error => {
        this.error(error['message']);
        this.spinner.hide();
      });
  }

  rechargeWallet() {
    this.spinner.show();
    this.dispatcherService.rechargeWallet(this.currentWalletDispatcherId, this.rechargeAmount, this.rechargeMethod, this.rechargeDescription)
      .subscribe(data => {
        this.success('success');
        this.getwalletData(this.currentWalletDispatcherId);
        this.spinner.hide();

      }, error => {
        this.error(error['message']);
        this.spinner.hide();
      });
  }

  adminCommission = 0;
  dispatcherCommisssion = 0;
  type = 'commission';
  id;
  disfrom;
  disto;

  editCommission(dispatcher){
    this.adminCommission = dispatcher.commission.dispatchAdminCommission;
    this.dispatcherCommisssion = dispatcher.commission.dispatcherCommission;
    this.type = dispatcher.dispatchPackageType;
    this.id = dispatcher._id;
    this.disfrom = dispatcher.commission.fromDate.split('T')[0];
    this.disto = dispatcher.commission.toDate.split('T')[0];
  }

  saveCommission(){
    this.dispatcherService.changeCommission(this.id, this.adminCommission, this.dispatcherCommisssion, this.type, this.disfrom, this.disto)
      .subscribe(data => {
        this.success('success');
        this.getDispatcherspagination();
      }, error => {
        this.error(error['message']);
      });
  }

  changeCode(id, code) {
    this.dispatcherService.changeCode(id, code)
      .subscribe(data => {
        this.success('success');
      }, error => {
        this.error(error['message']);
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

}
