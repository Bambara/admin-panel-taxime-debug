import { Routes } from '@angular/router';

import { PendingDriversComponent} from './pending-drivers/pending-drivers.component';
import { CategoriesComponent } from './categories/categories.component';
import { RegisteredDriversComponent } from './registered-drivers/registered-drivers.component';
import { NewVehicleComponent } from './vehicles/newVehicle/newVehicle.component';

export const ViewsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pending',
        component: PendingDriversComponent,
        data: {
          title: 'Peding Approvals Drivers',
          urls: [
            { title: 'Peding Approvals Drivers', url: '/pending' }
          ]
        }
      },

      {
        path: 'registereddrivers',
        component: RegisteredDriversComponent,
        data: {
          title: 'Registered Drivers',
          urls: [
            { title: 'Registered Drivers', url: '/registereddrivers' }
          ]
        }
      },

      //routing paths for Vehicle
      /******************************/
      {
        path: 'vehicle/newVehicle',
        component: NewVehicleComponent,
        data: {
          title: 'Add New Vehicle',
          urls: [
            { title: 'Add New Vehicle', url: '/vehicle/newVehicle' }
          ]
        }
      }
      /******************************/
      
    ]
  }
];
