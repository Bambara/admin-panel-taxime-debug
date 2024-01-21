import { Component, OnInit, ViewChild } from '@angular/core';
import { PendingDriversService } from '../../shared/services/pending-drivers.service'
import { from, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnotifyService } from 'ng-snotify';
import { DataTableDirective } from 'angular-datatables';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-pending-drivers',
  templateUrl: './pending-drivers.component.html',
  styleUrls: ['./pending-drivers.component.css']
})
export class PendingDriversComponent implements OnInit {
    data: any;
    driveDetails: any;
    // dtOptions: any = {};

    public driverPic = "";
    public drivingLicenceBackPic = "";
    public drivingLicenceFrontPic = "";
    public nicBackPic = "";
    public nicFrontPic = "";

    isCollapsed: Boolean[] = [];
    imgApiBase: string;

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
        public pending: PendingDriversService,
        private modalService: NgbModal,
        private spinner: NgxSpinnerService,
        private snotifyService: SnotifyService
    ) { }


    //***************************************** */

    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }
    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
        FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
    }

    excelData = [];

    exportAsXLSX():void {

        this.driveDetails.forEach(element => {
        this.excelData.push({
            Name : element.firstName + element.lastName,
            Mobile : element.mobile,
            email : element.email,
            nic : element.nic,
            gender : element.gender,
            company : element.company,
            birthday : element.birthday.split('T')[0],
            address : element.address.address + " , "+ element.address.street + " , "+ element.address.city ,
            lifeInsuranceNo : element.lifeInsuranceNo,
            RegisteredDate : element.recordedTime.split('T')[0] + '  ' +  element.recordedTime.split('T')[1].split('Z')[0],
        });
        });

        this.exportAsExcelFile(this.excelData, 'Registered Drivers To Approve');
    }
    //***************************************** */

    ngOnInit() {
        this.getdriverstoapprove();
        this.imgApiBase = environment.imgApiBase
    }

    getdriverstoapprove() {
        this.spinner.show();

        this.pending.getdriverstoapprove().subscribe(res => {
            console.log("response");
            console.log(res);
            this.data = res;
            
            this.driveDetails = this.data.content;
            this.driveDetails.forEach(element => {
                this.isCollapsed.push(false);
            });

            this.rerenderTable();

            this.spinner.hide();

        }, error => {
            console.log(error);
            this.driveDetails = []
            this.spinner.hide();
        });
    }

    approveDriver(id) {
        this.spinner.show();

        this.pending.approveDrivers(id).subscribe(data => {
            this.spinner.hide();
            console.log(data);
            this.success(data['message']);
            var enableDriversCount = parseInt(localStorage.getItem('enableDriversCount'));
            enableDriversCount--;
            localStorage.setItem('enableDriversCount', enableDriversCount.toString());
            this.getdriverstoapprove();
            // this.driveDetails = data.content;

        }, error => {
            console.log(error);
            this.error(error.message)
            this.spinner.hide();
        });
    }

  deleteDriver(id) {

    if (confirm("Are you sure to delete Driver " )) {
  
    this.pending.deleteDriver(id).subscribe(data => {
      console.log(data);
      this.success(data['message']);
      var enableDriversCount = parseInt(localStorage.getItem('enableDriversCount'));
      enableDriversCount--;
      localStorage.setItem('enableDriversCount', enableDriversCount.toString());
      this.getdriverstoapprove();
      // this.driveDetails = data.content;

    }, error => {
      console.log(error);

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

  success(msg){
    this.snotifyService.success(msg, {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      position: "rightTop"
    })
  }

  error(msg){
    this.snotifyService.error(msg, {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      position: "rightTop"
    })
  }
  
  info(msg){
    this.snotifyService.info(msg, {
      timeout: 2000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      position: "rightTop"
    })
  }

}
