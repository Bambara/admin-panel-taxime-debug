import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';

import { VehicleCategoriesComponent } from './vehicle-categories/vehicle-categories.component';
import { PromoListComponent } from './promo-list/promo-list.component';

import { SettingsRoutes } from './settings-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SnotifyModule, ToastDefaults, SnotifyService } from 'ng-snotify';

@NgModule({
  imports: [
    RouterModule.forChild(SettingsRoutes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DataTablesModule,
    NgxSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    SnotifyModule
  ],
  declarations: [
    VehicleCategoriesComponent,
    PromoListComponent,
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
    SnotifyService
  ]
})
export class SettingsModule { }
