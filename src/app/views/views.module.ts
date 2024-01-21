import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingDriversComponent } from './pending-drivers/pending-drivers.component'
import { CategoriesComponent } from './categories/categories.component';
import { ViewsRoutes } from './views.routing'
import { RouterModule } from '@angular/router';
import { RegisteredDriversComponent } from './registered-drivers/registered-drivers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewVehicleComponent } from './vehicles/newVehicle/newVehicle.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VehicleComponent } from './vehicles/vehicle/vehicle.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ViewsRoutes),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatCardModule,
    MatButtonModule,
    DataTablesModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    SnotifyModule,
    NgxPaginationModule
  ],
  declarations: [
    PendingDriversComponent,
    CategoriesComponent,
    RegisteredDriversComponent,
    NewVehicleComponent,
    VehicleComponent
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService
  ]
})
export class ViewsModule { }
