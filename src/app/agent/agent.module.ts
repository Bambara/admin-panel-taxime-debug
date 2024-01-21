import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AgentRoutingModule} from './agent-routing.module';
import {AgentListComponent} from './agent-list/agent-list.component';
import {AgentRegistrationComponent} from './agent-registration/agent-registration.component';
import {AgentProfileComponent} from './agent-profile/agent-profile.component';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';

import {DataTablesModule} from 'angular-datatables';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
    imports: [
        CommonModule,
        AgentRoutingModule,
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
        AgentListComponent,
        AgentRegistrationComponent,
        AgentProfileComponent
    ],
    providers: [
        {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
        SnotifyService
    ]
})
export class AgentModule {
}
