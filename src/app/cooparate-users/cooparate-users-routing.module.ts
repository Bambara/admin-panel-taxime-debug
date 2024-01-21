import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { CooparateUsersComponent } from './cooparate-users/cooparate-users.component'
import { from } from 'rxjs';

export const CooparateUsersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'cooparateUsers',
        component: CooparateUsersComponent,
        data: {
          title: 'Cooparate Users',
          urls: [
            { title: 'Cooparate Users', url: '/cooparateUsers' }
          ]
        }
      }
    ]
  }
];