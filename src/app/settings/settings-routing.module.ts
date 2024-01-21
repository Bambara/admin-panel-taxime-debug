import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleCategoriesComponent } from './vehicle-categories/vehicle-categories.component';
import { PromoListComponent } from './promo-list/promo-list.component';
import { Routes, RouterModule } from '@angular/router';


export const SettingsRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'vehicle-categories',
                component: VehicleCategoriesComponent,
                data: {
                    title: 'Vehicle Categories',
                    urls: [
                        { title: 'Settings'},
                        { title: 'Vehicle Categories', url: '/vehicle-categories' }
                    ]
                }
            },
            {
                path: 'promo-list',
                component: PromoListComponent,
                data: {
                    title: 'Promo List',
                    urls: [
                        { title: 'Settings' },
                        { title: 'Promo List', url: '/settings/promo-list' }
                    ]
                }
            },
        ]
    }
];

