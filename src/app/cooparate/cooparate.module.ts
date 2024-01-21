import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CooparateRoutes } from './cooparate-routing.module'
import { from } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddedUsersComponent } from './added-users/added-users.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SnotifyModule, ToastDefaults, SnotifyService } from 'ng-snotify';
import { ManualCustomersComponent } from './manual-customers/manual-customers.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CooparateRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    DataTablesModule,
    MatCardModule,
    MatButtonModule,
    NgxSpinnerModule,
    SnotifyModule,
    NgxPaginationModule
  ],
  declarations: [
    AddedUsersComponent,
    ManualCustomersComponent
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService
  ]
})
export class CooparateModule { }
