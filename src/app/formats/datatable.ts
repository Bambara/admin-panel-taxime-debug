//############ Module ################
import { DataTablesModule } from 'angular-datatables';


//########### html ##########
// <table datatable [dtOptions]="dtOptions" [dtTrigger]="dtTrigger">

//########### TS ##########

// dtOptions: DataTables.Settings =  {
//     pagingType: 'full_numbers',
//     pageLength: 5
//   };
// dtTrigger = new Subject();
// @ViewChild(DataTableDirective) dtElement: DataTableDirective;



// i = 0;
// rerenderTable(): void {
//     if(this.i == 0) {
//     this.dtTrigger.next();
//     this.i++;
// }
//        else {
//     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//         dtInstance.clear();
//         dtInstance.destroy();
//         this.dtTrigger.next();
//     });
// }
//   }
