import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PendingDriversComponent } from './pending-drivers/pending-drivers.component'
import { ApprovedDriversComponent } from './approved-drivers/approved-drivers.component';
import { ProfileDriverComponent } from './profile-driver/profile-driver.component';

import { DriversRoutes } from './drivers.routing.module';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

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
        RouterModule.forChild(DriversRoutes),
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
        ApprovedDriversComponent,
        ProfileDriverComponent,
    ],
    providers: [
        { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
        SnotifyService
    ]
})
export class DriversModule { }
