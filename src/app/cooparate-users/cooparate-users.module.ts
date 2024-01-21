import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CooparateUsersRoutes } from './cooparate-users-routing.module'
import { from } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CooparateUsersComponent } from './cooparate-users/cooparate-users.component';
import { DataTablesModule } from 'angular-datatables';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SnotifyModule, ToastDefaults, SnotifyService } from 'ng-snotify';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CooparateUsersRoutes),
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
    CooparateUsersComponent
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService
  ]
})
export class CooparateUsersModule { }
