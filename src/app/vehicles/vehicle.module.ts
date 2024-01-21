import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleRoutes } from './vehicle-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ApprovedVehiclesComponent } from './approved-vehicles/approved-vehicles.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnotifyModule, ToastDefaults, SnotifyService } from 'ng-snotify';
import { PendingVehiclesComponent } from './pending-vehicles/pending-vehicles.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VehicleRoutes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DataTablesModule,
    NgxSpinnerModule,
    NgSelectModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    SnotifyModule,
    NgxPaginationModule
  ],
  declarations: [
    ApprovedVehiclesComponent,
    PendingVehiclesComponent
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService
  ]
})
export class VehicleModule { }
