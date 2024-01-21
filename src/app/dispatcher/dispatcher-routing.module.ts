import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { DispatcherComponent } from './dispatcher/dispatcher.component';

export const DispatcherRoutingModule: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DispatcherComponent,
        data: {
          title: 'Dispatcher',
          urls: [
            { title: 'Dispatcher', url: '/dispatcher' }
          ]
        }
      }
    ]
  }
]