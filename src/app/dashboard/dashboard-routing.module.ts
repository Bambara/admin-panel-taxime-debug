import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from'./dashboard.component';
import { from } from 'rxjs';
import { Routes } from '@angular/router';

export const DashboardRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: DashboardComponent,
                data: {
                    title: 'Dashboard',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' }
                    ]
                }
            }
        ]
    }
];