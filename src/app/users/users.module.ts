import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment'
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmDirectionModule } from 'agm-direction';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatCardModule } from '@angular/material/card';
import { UsersRoutingModule } from './users-routing.module';
import { AppUsersComponent } from './app-users/app-users.component';
// import { PlacePredictionService } from '../shared/services/map/place-prediction.service'
import { MatButtonModule } from '@angular/material/button';
import { from } from 'rxjs';
import { SnotifyModule, ToastDefaults, SnotifyService } from 'ng-snotify';
//import { RoadPickupsComponent } from './road-pickups/road-pickups.component';
//import { CompletedBookingsComponent } from './completed-bookings/completed-bookings.component';
//import { TripViewComponent } from './trip-view/trip-view.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        SnotifyModule,
        RouterModule.forChild(UsersRoutingModule),
        AgmDirectionModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        NgxSpinnerModule,
        DataTablesModule,
        NgxPaginationModule,
        NgbModule
    ],
    declarations: [
        AppUsersComponent,
        //RoadPickupsComponent,
        //CompletedBookingsComponent,
        //TripViewComponent
    ],
    providers: [
        { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
        SnotifyService
    ],
})
export class UsersModule { }
