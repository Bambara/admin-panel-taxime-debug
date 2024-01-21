import { Component, OnInit, ViewChild } from '@angular/core';
import { AgentService } from '../../shared/services/agent.service';
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
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.css']
})
export class AgentListComponent implements OnInit {
  data: any;
  agentDetails: any;
  // dtOptions: any = {};

  public agentrPic = "";
  public drivingLicenceBackPic = "";
  public drivingLicenceFrontPic = "";
  public nicBackPic = "";
  public nicFrontPic = "";
  public transactions = [];

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
        public agentService: AgentService,
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

    this.agentDetails.forEach(element => {
      this.excelData.push({
        Name : element.companyName
        });
    });

    this.exportAsExcelFile(this.excelData, 'Registered agent list');
 }
  //***************************************** */

    ngOnInit() {
        this.getAgentsToApprove();
        this.imgApiBase = environment.imgApiBase
    }

        getAgentsToApprove() {
            this.spinner.show();

            this.agentService.getAgents().subscribe(res => {

                console.log("Agents");
                console.log(res);
                this.data = res;
                
                this.agentDetails = this.data.content;
                this.agentDetails.forEach(element => {
                    this.isCollapsed.push(false);
                });

                this.rerenderTable();

                this.spinner.hide();

            }, error => {
                console.log(error);
                this.agentDetails = []

                this.spinner.hide();
            });
        }

  approveagentr(id) {
    this.agentService.approveAgent(id).subscribe(data => {
      console.log(data);
      this.success(data['message']);
      var enableagentrsCount = parseInt(localStorage.getItem('enableagentrsCount'));
      enableagentrsCount--;
      localStorage.setItem('enableagentrsCount', enableagentrsCount.toString());
      this.getAgentsToApprove();
      // this.agentDetails = data.content;

    }, error => {
      console.log(error);

    });
  }

  deleteagentr(id) {

    if (confirm("Are you sure to delete agentr " )) {
  
    this.agentService.deleteAgent(id).subscribe(data => {
      console.log(data);
      this.success(data['message']);
      var enableagentrsCount = parseInt(localStorage.getItem('enableagentrsCount'));
      enableagentrsCount--;
      localStorage.setItem('enableagentrsCount', enableagentrsCount.toString());
      this.getAgentsToApprove();
      // this.agentDetails = data.content;

    }, error => {
      console.log(error);

    });
  }
  }

  viewTransactions(content, agent) {
    this.transactions = agent.transactionHistory;
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
