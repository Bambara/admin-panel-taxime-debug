import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovedVehiclesComponent } from './approved-vehicles/approved-vehicles.component';
import { Routes, RouterModule } from '@angular/router';
import { PendingVehiclesComponent } from './pending-vehicles/pending-vehicles.component';


export const VehicleRoutes: Routes = [
  {
    path: '',
    children: [
        {
            path: 'approved-vehicles',
            component: ApprovedVehiclesComponent,
            data: {
            title: 'Approved Vehicles',
            urls: [
                { title: 'Vehicles' },
                { title: 'Approved Vehicles', url: '/approved-vehicles' }
            ]
            }
        },
        {
            path: 'pending-vehicles',
            component: PendingVehiclesComponent,
            data: {
            title: 'Pending Vehicles',
            urls: [
                { title: 'Vehicles' },
                { title: 'Pending Vehicles', url: '/pending-vehicles' }
            ]
            }
        }
    ]
  }
];