import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SnotifyModule, ToastDefaults, SnotifyService } from 'ng-snotify';
import { CompanyWalletComponent } from './company-wallet/company-wallet.component';
import { RouterModule } from '@angular/router';
import { WalletRoutingModule } from './wallet-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(WalletRoutingModule),
        NgxSpinnerModule,
        SnotifyModule,
        DataTablesModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        NgbModule,
    ],
    declarations: [
        CompanyWalletComponent
    ],
    providers: [
        { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
        SnotifyService
    ]
})
export class WalletModule { }
