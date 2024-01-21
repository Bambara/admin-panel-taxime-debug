import { NgModule } from '@angular/core';
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
import { ActivatedRoute, Params } from '@angular/router';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
    selector: 'app-profile-drivers',
    templateUrl: './profile-driver.component.html',
    styleUrls: ['./profile-driver.component.css']
})
export class ProfileDriverComponent implements OnInit {

    currency = environment.CURRENCY;
    driverId: any;
    driverDetails: any;
    subCategoryData: any;
    vehicleData: any;

    constructor(
        public pendingDriversService: PendingDriversService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private snotifyService: SnotifyService,
        private driverService: DriverService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.driverId = this.route.snapshot.paramMap.get('id');
        //this.getDriverInfo(this.driverId);
        this.getDriverAllInfo(this.driverId);
    }

    // getDriverInfo(id) {
    //     this.spinner.show();
    //     this.driverService.getDriverInfoById(id).
    //     subscribe((response) => {
    //         console.log("driver info");
    //         console.log(response);
    //         this.driverDetails = response['content'];
    //         console.log("driver info");
    //         console.log(this.driverDetails);
    //         this.spinner.hide();
    //     }, error => {
    //         this.driverDetails = []
    //         this.spinner.hide();
    //         console.log("error");
    //         console.log(error);
    //         console.log(error.message);
    //         this.notificationError(error.message);
    //     });
    // }

    getDriverAllInfo(id) {
        this.spinner.show();
        this.driverService.getDriverAllInfoById(id).
        subscribe((response) => {
            console.log("driver all info");
            console.log(response);

            this.driverDetails = response['content1'];
            this.vehicleData = response['content2'];
            this.subCategoryData = response['subCatData'];
            
            this.spinner.hide();
        }, error => {
            this.driverDetails = []
            this.spinner.hide();
            console.log("error");
            console.log(error);
            console.log(error.message);
            this.notificationError(error.message);
        });
    }

    notificationError(msg) {
        this.snotifyService.error(msg, {
            timeout: 2000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            position: "rightTop"
        })
    }

}