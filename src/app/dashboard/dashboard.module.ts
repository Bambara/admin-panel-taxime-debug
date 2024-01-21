import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './dashboard-routing.module';
import { from } from 'rxjs';
import { environment } from '../../environments/environment'
import { DashboardComponent } from './dashboard.component';
import { AgmCoreModule } from '@agm/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatRadioModule,
        MatButtonModule,
        RouterModule.forChild(DashboardRoutes),
        AgmCoreModule.forRoot({
        apiKey: environment.googleMapApiKey
        }),
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule
    ],
    declarations: [
        DashboardComponent
    ]
})
export class DashboardModule { }
