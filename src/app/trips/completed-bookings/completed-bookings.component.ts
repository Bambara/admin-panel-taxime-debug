import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { HistoryService } from '../../shared/services/trip/history.service';
import { environment } from '../../../environments/environment';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-dispatch-history',
  templateUrl: './completed-bookings.component.html',
  styleUrls: ['./completed-bookings.component.css']
})
export class CompletedBookingsComponent implements OnInit {

  today = new Date();
  today1 = new Date();
  dispatchHistory: any;
  from;
  to;
  currency = environment.CURRENCY;

  constructor(
    private spinner: NgxSpinnerService,
    private historyService: HistoryService,
    ) { }

    dtOptions: DataTables.Settings = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [0, 'desc']
    };
    dtTrigger = new Subject();
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    
  ngOnInit() {
    this.today1.setDate(this.today.getDate() + 1);
    this.from = this.today.getFullYear() + '-' + ((this.today.getMonth() + 1) > 9 ? '' : '0') + (this.today.getMonth() + 1) + '-' + (this.today.getDate() > 9 ? '' : '0') + this.today.getDate();
    this.to = this.today1.getFullYear() + '-' + ((this.today1.getMonth() + 1) > 9 ? '' : '0') + (this.today1.getMonth() + 1) + '-' + (this.today1.getDate() > 9 ? '' : '0') + (this.today1.getDate());

    this.getDispatchHistory();
  }

  getDispatchHistory(){

    this.spinner.show();

    this.historyService.getdispatchHistory(this.from, this.to).subscribe(data => {
      this.spinner.hide();
      console.log(data);
      this.dispatchHistory = data.content;

      data.content1.forEach(element => {
        this.dispatchHistory.push(element);
      });
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
    this.getDispatchHistory();

    this.dispatchHistory.forEach(element => {
      this.excelData.push({
        CustomerName: element.customerName,
        CustomerTelephoneNo: element.customerTelephoneNo,
        // Category: element.vehicleCategory + ' : ' + element.vehicleSubCategory,
        // RegisteredDate: element.recordedTime.split('T')[0],
        ActualPrice : element.totalPrice,
        EstimatedCost: element.hireCost,
        WaitingCost: element.waitingCost,
        VehicleCategory: element.vehicleCategory,
        VehicleSubCategory: element.vehicleSubCategory,
        Type: element.type,
        BidValue: element.bidValue,
        Distance: element.distance,
        DropDateTime: element.dropDateTime,
        TripTime: element.tripTime
      });
    });

    this.exportAsExcelFile(this.excelData, 'Dispatch History');
  }
  //***************************************** */

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
