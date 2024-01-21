import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { TripsBookingComponent } from './trips-booking/trips-booking.component';
import { from } from 'rxjs';
import { RoadPickupsComponent } from './road-pickups/road-pickups.component';
import { CompletedBookingsComponent } from './completed-bookings/completed-bookings.component';
import { TripViewComponent } from './trip-view/trip-view.component';
// import { HistoryComponent } from './history_old/history.component';
// import { DispatchHistoryComponent } from './dispatch-history/dispatch-history.component';


export const TripsRoutingModule: Routes = [
    {
        path: '',
        children: [
            {
                path: 'trips-booking',
                component: TripsBookingComponent,
                data: {
                    title: 'Trips Booking',
                    urls: [
                        { title: 'Trips'},
                        { title: 'Trips Booking', url: '/trips-booking' }
                    ]
                }
            },
            {
                path: 'road-pickups',
                component: RoadPickupsComponent,
                data: {
                    title: 'Road Pickups',
                    urls: [
                        { title: 'Trips'},
                        { title: 'Road Pickups', url: '/road-pickups' }
                    ]
                }
            },
            {
                path: 'completed-bookings',
                component: CompletedBookingsComponent,
                data: {
                    title: 'Completed Bookings',
                    urls: [
                        { title: 'Trips'},
                        { title: 'Completed Bookings', url: '/completed-bookings' }
                    ]
                }
            },
            {
                path: 'trip-view/:id',
                component: TripViewComponent,
                data: {
                    title: 'Trip Details',
                    urls: [
                        { title: 'Trips' },
                        { title: 'Trip Details', url: '/trips/trip-view/:id' } 
                    ]
                }
            },
        ]
    },
    // {
    //     path: 'history',
    //     component: HistoryComponent,
    //     data: {
    //     title: 'History',
    //     urls: [
    //         { title: 'History', url: '/history' }
    //     ]
    //     }
    // },
    // {
    //     path: 'dispatchHistory',
    //     component: DispatchHistoryComponent,
    //     data: {
    //     title: 'Dispatch History',
    //     urls: [
    //         { title: 'Dispatch History', url: '/dispatchHistory' }
    //     ]
    //     }
    // }
]