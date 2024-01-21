import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { NewVehicleService } from '../../shared/services/vehicle/new-vehicle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-pending-vehicles',
  templateUrl: './pending-vehicles.component.html',
  styleUrls: ['./pending-vehicles.component.css']
})
export class PendingVehiclesComponent implements OnInit {

  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 5,
    order : [0, 'desc']
  };
  dtTrigger = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  vehicleDetails: any;
  isCollapsed: any;
  vehicleBookPic1: any;
  vehicleFrontPic1: any;
  vehicleInsurancePic1: any;
  vehicleRevenuePic1: any;
  vehicleSideViewPic1: any;
  imgApiBase: any;
  vehicleCategory: any;
  vehicleSubcategory: any;
  vehicleCategoryList: any;
  vehicleSubcategoryList: any;


  constructor(
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private newVehicleService: NewVehicleService,
    private snotifyService: SnotifyService
  ) { }

  ngOnInit() {
    this.getApprovelVehicles();

    //get Vehicle Category List
    this.newVehicleService.getVehicleCategoryAllData().subscribe(res => {
      this.vehicleCategoryList = res.content;
    })

    this.imgApiBase = environment.imgApiBase;
  }



  getSubcategorys(deviceValue) {
    console.log(deviceValue);
    
    this.vehicleSubcategoryList = deviceValue.subCategory;
  }

  i = 0;
  // imgApiBase: string;
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

  openVerticallyCentered(content, vehicle) {
    this.viewAttachments(vehicle);
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  viewAttachments(vehicle) {
    this.vehicleBookPic1 = vehicle.vehicleBookPic;
    this.vehicleFrontPic1 = vehicle.vehicleFrontPic;
    this.vehicleInsurancePic1 = vehicle.vehicleInsurancePic;
    this.vehicleRevenuePic1 = vehicle.vehicleRevenuePic;
    this.vehicleSideViewPic1 = vehicle.vehicleSideViewPic;
  }

    getApprovelVehicles() {
        this.spinner.show();

        this.newVehicleService.getApprovelVehicles().subscribe(data => {

        this.vehicleDetails = data['content'];
        console.log(this.vehicleDetails);
        this.vehicleDetails.forEach(element => {
            // this.isCollapsed.push(false);
        });
        this.rerenderTable();
        this.spinner.hide();

        }, error => {
        console.log(error);
        this.vehicleDetails = []

        this.spinner.hide();
        });
    }

  approveVehicle(id) {
    this.newVehicleService.approveVehicle(id).subscribe(data => {
      console.log(data);
      this.success(data['message']);
      this.getApprovelVehicles();

    }, error => {
      console.log(error);

    });
  }
  
  id = '';
  assign(vehicle, owner){
    
    console.log(vehicle);

    this.id = vehicle._id

    console.error(this.id);

    
    this.vehicleCategory = vehicle.vehicleCategory
    this.vehicleSubcategory = vehicle.vehicleSubCategory
  
  }

  
  deleteVehicle(id) {

    if (confirm("Are you sure to delete Driver " )) {
  
    this.newVehicleService.deleteVehicle(id).subscribe(data => {
      console.log(data);
      this.success(data['message']);
      // var enableDriversCount = parseInt(localStorage.getItem('enableDriversCount'));
      // enableDriversCount--;
      // localStorage.setItem('enableDriversCount', enableDriversCount.toString());
      this.getApprovelVehicles();
      // this.driveDetails = data.content;

    }, error => {
      console.log(error);

    });
  }
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

}
