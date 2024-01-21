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
    templateUrl: './trip-view.component.html',
    styleUrls: ['./trip-view.component.css']
})
export class TripViewComponent implements OnInit {

    ngOnInit() {

    }

}