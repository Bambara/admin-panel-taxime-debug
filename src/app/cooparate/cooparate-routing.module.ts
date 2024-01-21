import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AddedUsersComponent } from './added-users/added-users.component'
  import { from } from 'rxjs';
import { ManualCustomersComponent } from './manual-customers/manual-customers.component';

export const CooparateRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'addedUsers',
        component: AddedUsersComponent,
        data: {
          title: 'Added Users',
          urls: [
            { title: 'Added Users', url: '/addedUsers' }
          ]
        }
      },
      {
        path: 'manualCustomers',
        component: ManualCustomersComponent,
        data: {
          title: 'Manual Customers',
          urls: [
            { title: 'Manual Customers', url: '/manualCustomers' }
          ]
        }
      }
    ]
  }
];