import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HistoryService } from '../../shared/services/trip/history.service'
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../environments/environment';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-history',
  templateUrl: './road-pickups.component.html',
  styleUrls: ['./road-pickups.component.css']
})
export class RoadPickupsComponent implements OnInit {

  roadPickupData: any;

  today = new Date();
  today1 = new Date();

  from; to;
  currency = environment.CURRENCY;


  constructor(
    private historyService: HistoryService,
    private spinner: NgxSpinnerService,
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

    this.getRoadPickupTrip();

    // console.log(this.today.getFullYear() + '-' + ((this.today.getMonth() + 1 ) > 9 ? '' : '0' )+ (this.today.getMonth() + 1 ) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate());
  }


  getRoadPickupTrip() {

    console.log(this.from)

    this.spinner.show();

    this.historyService.getRoadPickupTrip(this.from, this.to).subscribe(data => {
      this.spinner.hide();
      console.log(data);
      this.roadPickupData = data.content
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

    this.roadPickupData.forEach(element => {

      this.excelData.push({
        firstName: element.firstName,
        lastName: element.lastName,
        mobile: element.mobile,
        email: element.email,
        tripTime: element.tripTime,
        waitingCost: element.waitingCost,
        waitTime: element.waitTime,
        vehicleCategory: element.vehicleCategory,
        vehicleSubCategory: element.vehicleSubCategory,
        driverFirstName: element.driver[0].firstName,
        driverLastName: element.driver[0].lastName,
        vehicleRegistrationNo: element.vehicle[0].vehicleRegistrationNo,
        pickupLocation: element.pickupLocation.address,
        pickupDateTime: element.pickupDateTime,
        dropLocations: element.dropLocations[0].address,
        distance: element.distance,
        totalCost: element.totalCost,
        status: element.status
        // address: element.address.address + " , " + element.address.street + " , " + element.address.city,
        // lifeInsuranceNo: element.lifeInsuranceNo,
        // RegisteredDate: element.recordedTime.split('T')[0] + '  ' + element.recordedTime.split('T')[1].split('Z')[0],
      });

    });

    this.exportAsExcelFile(this.excelData, 'Failed Dispatches History');
  }
  //***************************************** */

}
