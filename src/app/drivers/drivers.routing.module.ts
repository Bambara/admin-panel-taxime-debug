import { Routes } from '@angular/router';

import { PendingDriversComponent} from './pending-drivers/pending-drivers.component';
import { ApprovedDriversComponent } from './approved-drivers/approved-drivers.component';
import { ProfileDriverComponent } from './profile-driver/profile-driver.component';

export const DriversRoutes: Routes = [
    {
        path: '',
        children: [
        {
            path: 'pending-drivers',
            component: PendingDriversComponent,
            data: {
                title: 'Pending Drivers',
                urls: [
                    { title: 'Drivers' },
                    { title: 'Pending Drivers', url: '/drivers/pending-drivers' }
                ]
            }
        },

        {
            path: 'approved-drivers',
            component: ApprovedDriversComponent,
            data: {
                title: 'Approved Drivers',
                urls: [
                    { title: 'Drivers' },
                    { title: 'Approved Drivers', url: '/drivers/approved-drivers' }
                ]
            }
        },

        {
            path: 'profile-driver/:id',
            component: ProfileDriverComponent,
            data: {
                title: 'Driver Profile',
                urls: [
                    { title: 'Drivers' },
                    { title: 'Driver Profile', url: '/drivers/profile-driver/:id' } 
                ]
            }
        },
        
        ]
    }
];
