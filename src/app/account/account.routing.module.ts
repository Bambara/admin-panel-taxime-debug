import {Routes} from '@angular/router';

import {AdminProfileComponent} from './admin-profile/admin-profile.component';

export const AccountRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'admin-profile/:id',
                component: AdminProfileComponent,
                data: {
                    title: 'Admin Profile',
                    urls: [
                        { title: 'Account' },
                        { title: 'Admin Profile', url: '/account/admin-profile/:id' }
                    ]
                }
            },
        ]
    }
];
