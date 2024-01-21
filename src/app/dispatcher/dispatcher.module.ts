import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispatcherComponent } from './dispatcher/dispatcher.component';
import { RouterModule } from '@angular/router';
import { DispatcherRoutingModule } from './dispatcher-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DispatcherRoutingModule),
    NgxSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    SnotifyModule,
    DataTablesModule,
    NgbModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ],
  declarations: [
    DispatcherComponent
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService
  ]
})
export class DispatcherModule { }
