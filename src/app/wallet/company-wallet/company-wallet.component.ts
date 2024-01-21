import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { WalletService } from '../../shared/services/wallet/wallet.service';
import { environment } from '../../../environments/environment';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
    selector: 'app-company-wallet',
    templateUrl: './company-wallet.component.html',
    styleUrls: ['./company-wallet.component.css']
})
export class CompanyWalletComponent implements OnInit {

    today = new Date();
    today1 = new Date();
    walletData: any;
    totalEranings: any = 0;
    from;
    to;
    currency = environment.CURRENCY;

    constructor(
        private spinner: NgxSpinnerService,
        private walletService: WalletService
    ) { }

    dtOptions: DataTables.Settings = {
        pagingType: 'full_numbers',
        pageLength: 5,
        order: [0, 'desc']
    };
    dtTrigger = new Subject();
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;

    ngOnInit() {

        this.today1.setDate(this.today.getDate() + 1);
        this.from = this.today.getFullYear() + '-' + ((this.today.getMonth() + 1) > 9 ? '' : '0') + (this.today.getMonth() + 1) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate();
        this.to = this.today1.getFullYear() + '-' + ((this.today1.getMonth() + 1) > 9 ? '' : '0') + (this.today1.getMonth() + 1) + '-' + (this.today1.getDate() > 9 ? '' : '0') + (this.today1.getDate());

        this.getCompanyWallet()
    }

    getCompanyWallet(){

        this.spinner.show();

        this.walletService.getCompanyWallet(this.from, this.to).subscribe(data => {
            this.spinner.hide();
            console.log(data);
            this.totalEranings = data.totalEarnings;
            this.walletData = data.companyWallet;
            this.rerenderTable();

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

    this.walletData.forEach(element => {

        this.excelData.push({
        dateTime: element.transactionHistory.dateTime,
        transactionMethod: element.transactionHistory.method,
        transactionAmount: element.transactionHistory.transactionAmount,
        transactionType: element.transactionHistory.transactionType,
        PickupLocation: element.transactionHistory.trip.pickupLocation.address,
        destination: element.transactionHistory.trip.destinations[0].address,
        tripEarning: element.transactionHistory.trip.tripEarning,
        totalTripValue: element.transactionHistory.trip.totalTripValue,
        });

        
        if (element.transactionHistory.transactionType == 'dispatch') {

        this.excelData.push({
            customerName: element.tripdataDispatch[0].customerName,
            customerTelephoneNo: element.tripdataDispatch[0].customerTelephoneNo,
            driverName: element.tripdataDispatch[0].noifiedDrivers[0].driverInfo.driverName,
            driverContactNumber: element.tripdataDispatch[0].noifiedDrivers[0].driverInfo.driverContactNumber,
            vehicleRegistrationNo: element.tripdataDispatch[0].noifiedDrivers[0].vehicleInfo.vehicleRegistrationNo,
            type: element.tripdataDispatch[0].type,
            vehicleCategory: element.tripdataDispatch[0].vehicleCategory,
            vehicleSubCategory: element.tripdataDispatch[0].vehicleSubCategory,
        });

        } else if (element.transactionHistory.transactionType == 'roadPickup') {

        this.excelData.push({
            customerName: element.tripdataRoadpickup[0].firstName,
            customerTelephoneNo: element.tripdataRoadpickup[0].mobile,
            vehicleCategory: element.tripdataRoadpickup[0].vehicleCategory,
            vehicleSubCategory: element.tripdataRoadpickup[0].vehicleSubCategory,
        });

        } else if (element.transactionHistory.transactionType == 'trip') {

        this.excelData.push({
            customerName: element.tripdataTrip[0].firstName,
            customerTelephoneNo: element.tripdataTrip[0].mobile,
            driverName: element.tripdataTrip[0].noifiedDrivers[0].driverInfo.driverName,
            driverContactNumber: element.tripdataTrip[0].noifiedDrivers[0].driverInfo.driverContactNumber,
            vehicleRegistrationNo: element.tripdataTrip[0].noifiedDrivers[0].vehicleInfo.vehicleRegistrationNo,
            vehicleCategory: element.tripdataTrip[0].vehicleCategory,
            vehicleSubCategory: element.tripdataTrip[0].vehicleSubCategory,
        });

        } else {

        this.excelData.push({
            customerName: element.tripdataTrip[0].passengerDetails.name,
            customerTelephoneNo: element.tripdataTrip[0].passengerDetails.contactNumber,
            driverName: element.tripdataTrip[0].noifiedDrivers[0].driverInfo.driverName,
            driverContactNumber: element.tripdataTrip[0].noifiedDrivers[0].driverInfo.driverContactNumber,
            vehicleRegistrationNo: element.tripdataTrip[0].noifiedDrivers[0].vehicleInfo.vehicleRegistrationNo,
            vehicleCategory: element.tripdataTrip[0].vehicleCategory,
            vehicleSubCategory: element.tripdataTrip[0].vehicleSubCategory,
        });
        }

    });

    this.exportAsExcelFile(this.excelData, 'Company Wallet');
    }
    //***************************************** */


    getMoreData(id, type){

        this.spinner.show();

        this.walletService.getMoreData(id, type).subscribe(data => {
        this.spinner.hide();
        console.log(data);
        this.rerenderTable();

        }, error => {
        console.log(error);
        this.spinner.hide();
        });

    }

    i = 0;

    rerenderTable(): void {
        if (this.i == 0) {
        this.dtTrigger.next();
        this.i++;
        this.spinner.hide();
        }
        else {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.clear();
            dtInstance.destroy();
            this.dtTrigger.next();
            this.spinner.hide();
        });
        }
    }

}
