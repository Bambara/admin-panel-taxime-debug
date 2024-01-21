import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuardService } from '../app/shared/services/auth-guard.service'

export const Approutes: Routes = [
    /* Admin Login */
    {
        path: 'login',
        component: LoginComponent
    },
    /* Dahsboard */
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        canActivate: [AuthGuardService],
        data: { 
            expectedRole: ['super','manager','finance' ,'operation', 'dispatcher','generic','agent']
        },
    },
    
    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
            expectedRole: ['super','manager','finance' ,'operation', 'dispatcher','generic','agent']
        },
        children: [
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        {
            path: 'dashboard',
            loadChildren: './dashboard/dashboard.module#DashboardModule'
        }
        ]
    },
    /* Trips */
    // {
    //     path: '',
    //     component: FullComponent,
    //     canActivate: [AuthGuardService],
    //     data: { 
    //         expectedRole: ['super', 'finance', 'dispatcher' ,'operation']
    //     },
    //     children: [
    //         { path: '', redirectTo: '/trips', pathMatch: 'full' },
    //         {
    //             path: 'trips',
    //             loadChildren: './trips/trips.module#TripsModule'
    //         }
    //     ]
    // },
    /* Wallet */
    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
            expectedRole: ['super', 'manager', 'finance', 'agent' ]
        },
        children: [
            { path: '', redirectTo: '/wallet', pathMatch: 'full' },
            {
                path: 'wallet',
                loadChildren: './wallet/wallet.module#WalletModule'
            }
        ]
    },

    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
            expectedRole: ['super', 'finance', 'dispatcher' ,'operation']
        },
        children: [
            { path: '', redirectTo: '/component', pathMatch: 'full' },
            {
                path: 'component',
                loadChildren: './component/component.module#ComponentsModule'
            }
        ]
    },
    /* drivers */
    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
            expectedRole: ['super', 'manager', 'dispatcher', 'operation', 'agent']
        },
        children: [
            { path: '', redirectTo: '/drivers', pathMatch: 'full' },
            {
              path: 'drivers',
              loadChildren: './drivers/drivers.module#DriversModule'
            }
        ]
    },

    {
        path: 'starter',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
        expectedRole: ['super', 'manager', 'finance' ,'operation']
        },
        children: [
        // { path: '', redirectTo: '/starter', pathMatch: 'full' },
        {
            path: 'starter',
            loadChildren: './starter/starter.module#StarterModule'
        },
        {
            path: 'component',
            loadChildren: './component/component.module#ComponentsModule'
        },
        {
            path: 'views',
            loadChildren: './views/views.module#ViewsModule'
        }
        ]
    },
    /* settings */
    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
            expectedRole: ['super']
        },
        children: [
            { path: '', redirectTo: '/settings', pathMatch: 'full' },
            {
                path: 'settings',
                loadChildren: './settings/settings.module#SettingsModule'
            }
        ]
    },
    /* vehicles */
    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
            expectedRole: ['super', 'manager', 'dispatcher', 'operation', 'agent']
        },
        children: [
            { path: '', redirectTo: '/vehicles', pathMatch: 'full' },
            {
                path: 'vehicles',
                loadChildren: './vehicles/vehicle.module#VehicleModule'
            }
        ]
    },

    /* passengers */
    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
        expectedRole: ['super', 'finance', 'dispatcher' ,'operation']
        },
        children: [
        { path: '', redirectTo: '/users', pathMatch: 'full' },
        {
            path: 'users',
            loadChildren: './users/users.module#UsersModule'
        }
        ]
    },
    {
        path: 'cooparate',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
        expectedRole: ['super', 'manager', 'finance']
        },
        children: [
        { path: '', redirectTo: '/cooparate', pathMatch: 'full' },
        {
            path: 'cooparateUsers',
            loadChildren: './cooparate/cooparate.module#CooparateModule'
        }
        ]
    },
    {
        path: 'cooparateUsers',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
        expectedRole: ['super', 'manager', 'finance']
        },
        children: [
        { path: '', redirectTo: '/cooparateUsers', pathMatch: 'full' },
        {
            path: 'cooparate-Users',
            loadChildren: './cooparate-users/cooparate-users.module#CooparateUsersModule'
        }
        ]
    },
    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
        expectedRole: ['super', 'finance', 'dispatcher' ,'operation']
        },
        children: [
        { path: '', redirectTo: '/trips', pathMatch: 'full' },
        {
            path: 'trips',
            loadChildren: './trips/trips.module#TripsModule'
        }
        ]
    },
    {
        path: 'dispatcher',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: { 
        expectedRole: ['super', 'finance']
        },
        children: [
        { path: '', redirectTo: '/dispatcher', pathMatch: 'full' },
        {
            path: 'dispatcher',
            loadChildren: './dispatcher/dispatcher.module#DispatcherModule'
        }
        ]
    },
    /* admin account */
    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuardService],
        data: {
            expectedRole: ['super','manager','finance' ,'operation', 'dispatcher','generic']
        },
        children: [
            { path: '', redirectTo: '/account', pathMatch: 'full' },
            {
                path: 'account',
                loadChildren: './account/account.module#AccountModule'
            },
            {
                path: 'agent',
                loadChildren: './agent/agent.module#AgentModule'
            }
        ]
    },
    
];
