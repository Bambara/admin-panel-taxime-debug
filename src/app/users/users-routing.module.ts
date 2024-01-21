import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { AppUsersComponent } from './app-users/app-users.component';
import { from } from 'rxjs';
//import { RoadPickupsComponent } from './road-pickups/road-pickups.component';
//import { CompletedBookingsComponent } from './completed-bookings/completed-bookings.component';
//import { TripViewComponent } from './trip-view/trip-view.component';


export const UsersRoutingModule: Routes = [
    {
        path: '',
        children: [
            {
                path: 'app-users',
                component: AppUsersComponent,
                data: {
                    title: 'App Users',
                    urls: [
                        { title: 'Users'},
                        { title: 'App Users', url: '/app-users' }
                    ]
                }
            },
            // {
            //     path: 'road-pickups',
            //     component: RoadPickupsComponent,
            //     data: {
            //         title: 'Road Pickups',
            //         urls: [
            //             { title: 'Trips'},
            //             { title: 'Road Pickups', url: '/road-pickups' }
            //         ]
            //     }
            // },
            // {
            //     path: 'completed-bookings',
            //     component: CompletedBookingsComponent,
            //     data: {
            //         title: 'Completed Bookings',
            //         urls: [
            //             { title: 'Trips'},
            //             { title: 'Completed Bookings', url: '/completed-bookings' }
            //         ]
            //     }
            // },
            // {
            //     path: 'trip-view/:id',
            //     component: TripViewComponent,
            //     data: {
            //         title: 'Trip Details',
            //         urls: [
            //             { title: 'Trips' },
            //             { title: 'Trip Details', url: '/trips/trip-view/:id' } 
            //         ]
            //     }
            // },
        ]
    }
]