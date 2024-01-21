import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { CompanyWalletComponent } from './company-wallet/company-wallet.component';


export const WalletRoutingModule: Routes = [
    {
        path: '',
        children: [
            {
                path: 'company-wallet',
                component: CompanyWalletComponent,
                data: {
                    title: 'Company Wallet',
                    urls: [
                        { title: 'Wallet'},
                        { title: 'Company Wallet', url: '/company-wallet' }
                    ]
                }
            }
        ]
    }
]
