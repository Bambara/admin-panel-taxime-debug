import { Role } from '../../enums/role.enum';
import { RouteInfo } from './sidebar.metadata';

var adminRole = localStorage.getItem('role');

export const ROUTES: RouteInfo[] = [
    //dashboard
    {
        path: '/dashboard',
        title: 'Dashboard',
        icon: 'fa fa-dashboard',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
    },
    //Trips
    //localStorage.getItem('role') === (Role.super || Role.manager || Role.dispatch || Role.operation) ?
    ["super", "manager", "dispatch", "operation"].includes(localStorage.getItem('role')) ?
    {
        path: '',
        title: 'Trips',
        icon: 'fa fa-plane',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
        {
            path: '/trips/trips-booking',
            title: 'Trips Booking',
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        },
        {
            path: '/trips/road-pickups',
            title: 'Road Pickups',
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        },
        {
            path: '/trips/completed-bookings',
            title: 'Completed Bookings',
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        }
        ]

    } : null,

    //drivers
    //localStorage.getItem('role') === 'super' || 'manager' || 'dispatch' || 'operation' || 'agent' ?
    ["super", "manager", "dispatch", "operation", "agent"].includes(localStorage.getItem('role')) ?
    {
        path: '/drivers',
        title: 'Drivers',
        icon: 'fa fa-user',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
        {
            path: '/drivers/pending-drivers',
            title: 'Pending Drivers',
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        },
        {
            path: '/drivers/approved-drivers',
            title: 'Approved Drivers',
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        }
        ]
    } : null,

    // {
    //     path: '',
    //     title: 'Drivers',
    //     icon: 'fa fa-user',
    //     class: 'has-arrow',
    //     label: '',
    //     labelClass: '',
    //     extralink: false,
    //     submenu: [
    //     {
    //         path: '/starter/views/pending',
    //         title: 'Pending Driver Approvals',
    //         icon: '',
    //         class: '',
    //         label: '',
    //         labelClass: '',
    //         extralink: false,
    //         submenu: []
    //     },
    //     {
    //         path: '/starter/views/registereddrivers',
    //         title: 'Approved Drivers',
    //         icon: '',
    //         class: '',
    //         label: '',
    //         labelClass: '',
    //         extralink: false,
    //         submenu: []
    //     }
    //     ]
    // },



    //Vehicles
    //localStorage.getItem('role') === [ Role.super, Role.manager, Role.dispatch, Role.operation] ?
    ["super", "manager", "dispatch", "operation", "agent"].includes(localStorage.getItem('role')) ?
    {
        path: '',
        title: 'Vehicles',
        icon: 'mdi mdi-car',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
        {
            path: '/vehicles/pending-vehicles',
            title: 'Pending Vehicles',
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        },
        {
            path: '/vehicles/approved-vehicles',
            title: 'Approved Vehicles',
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        }
        ]
    } : null,

    //passengers
    // ["super", "manager", "dispatch", "operation"].includes(localStorage.getItem('role')) ?
    // {
    //     path: '',
    //     title: 'Passengers',
    //     icon: 'fa fa-users',
    //     class: 'has-arrow',
    //     label: '',
    //     labelClass: '',
    //     extralink: false,
    //     submenu: [
    //     {
    //         path: '/users/app-users',
    //         title: 'App Users',
    //         icon: '',
    //         class: '',
    //         label: '',
    //         labelClass: '',
    //         extralink: false,
    //         submenu: []
    //     },
        
    //     ]
    // } : null,

    //localStorage.getItem('role') === (Role.super || Role.manager || Role.dispatch || Role.operation) ?
    ["super", "manager", "dispatch", "operation"].includes(localStorage.getItem('role')) ?
    {
        path: '',
        title: 'Passengers',
        icon: 'fa fa-users',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
        {
            path: '/cooparate/cooparateUsers/addedUsers',
            title: 'App Users',
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        },
        {
            path: '/cooparate/cooparateUsers/manualCustomers',
            title: 'General Users',
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        }
        ]
    } : null,

  // menu item cooparate Users
  // {
  //   path: '',
  //   title: 'Cooparate Users',
  //   icon: 'fa fa-user-circle',
  //   class: 'has-arrow',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: [
  //     {
  //       path: '/cooparateUsers/cooparate-Users/cooparateUsers',
  //       title: 'Added Users',
  //       icon: '',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     }
  //   ]
  // },

  
    // dispatch users
    //localStorage.getItem('role') === (Role.super || Role.manager || Role.dispatch || Role.operation) ?
    ["super", "manager", "dispatch", "operation"].includes(localStorage.getItem('role')) ?
    {
        path: '',
        title: 'Dispatcher Users',
        icon: 'fa fa-share',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
        {
            path: '/dispatcher/dispatcher',
            title: 'Dispatcher Users',
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        }
        ]

    } : null,

    // agents
    //localStorage.getItem('role') === (Role.super || Role.manager) ? 
    ["super", "manager"].includes(localStorage.getItem('role')) ?
    {
        path: '',
        title: 'Agents',
        icon: 'fa fa-briefcase',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
            {
                path: '/agent/agent-list',
                title: 'Agent List',
                icon: '',
                class: '',
                label: '',
                labelClass: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/agent/agent-registration',
                title: 'Agent Registration',
                icon: '',
                class: '',
                label: '',
                labelClass: '',
                extralink: false,
                submenu: []
            }
            
        ]

    } : null,
    
    // company wallet
    //localStorage.getItem('role') === (Role.super || Role.manager || Role.finance) ? 
    ["super", "manager", "finance", "agent"].includes(localStorage.getItem('role')) ?
    {
        path: '',
        title: 'Wallet',
        icon: 'fa fa-credit-card',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
        {
            path: '/wallet/company-wallet',
            title: 'Company Wallet',
            icon: '',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
        }
        ]

    } : null,

    // reports
    // localStorage.getItem('role') === 'develop' ?
    // {
    //     path: '',
    //     title: 'Reports',
    //     icon: 'fa fa-file',
    //     class: 'has-arrow',
    //     label: '',
    //     labelClass: '',
    //     extralink: false,
    //     submenu: [
    //     {
    //         path: '',
    //         title: '--',
    //         icon: '',
    //         class: '',
    //         label: '',
    //         labelClass: '',
    //         extralink: false,
    //         submenu: []
    //     }
    //     ]
    // }: null,


    // settings
    //localStorage.getItem('role') === (Role.super) ? 
    ["super"].includes(localStorage.getItem('role')) ?
    {
        path: '',
        title: 'Settings',
        icon: 'fa fa-cog',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
            {
                path: '/settings/vehicle-categories',
                title: 'Vehicle Categories',
                icon: '',
                class: '',
                label: '',
                labelClass: '',
                extralink: false,
                submenu: []
            },
            {
                path: '/settings/promo-list',
                title: 'Promotion List',
                icon: '',
                class: '',
                label: '',
                labelClass: '',
                extralink: false,
                submenu: []
            }
        ]

    }: null,

  // {
  //   path: '',
  //   title: 'Personal',
  //   icon: '',
  //   class: 'nav-small-cap',
  //   label: '',
  //   labelClass: '',
  //   extralink: true,
  //   submenu: []
  // },
  // {
  //   path: '/starter',
  //   title: 'Starter Page',
  //   icon: 'mdi mdi-gauge',
  //   class: '',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: []
  // },
//   {
//     path: '',
//     title: 'UI Components',
//     icon: '',
//     class: 'nav-small-cap',
//     label: '',
//     labelClass: '',
//     extralink: true,
//     submenu: []
//   },
//   {
//     path: '',
//     title: 'Component',
//     icon: 'mdi mdi-bullseye',
//     class: 'has-arrow',
//     label: '',
//     labelClass: '',
//     extralink: false,
//     submenu: [
//       {
//         path: '/component/accordion',
//         title: 'Accordion',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/alert',
//         title: 'Alert',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/carousel',
//         title: 'Carousel',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/dropdown',
//         title: 'Dropdown',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/modal',
//         title: 'Modal',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/pagination',
//         title: 'Pagination',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/poptool',
//         title: 'Popover & Tooltip',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/progressbar',
//         title: 'Progressbar',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/rating',
//         title: 'Ratings',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/tabs',
//         title: 'Tabs',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/timepicker',
//         title: 'Timepicker',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/buttons',
//         title: 'Button',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       },
//       {
//         path: '/component/cards',
//         title: 'Card',
//         icon: '',
//         class: '',
//         label: '',
//         labelClass: '',
//         extralink: false,
//         submenu: []
//       }
//     ]
//   },
  // {
  //   path: '',
  //   title: 'Menu Levels',
  //   icon: 'mdi mdi-arrange-send-backward',
  //   class: 'has-arrow',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: [
  //     {
  //       path: 'javascript:void(0);',
  //       title: 'Second Level',
  //       icon: '',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: true,
  //       submenu: []
  //     },
  //     {
  //       path: '',
  //       title: 'Second Child',
  //       icon: '',
  //       class: 'has-arrow',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: [
  //         {
  //           path: 'javascript:void(0);',
  //           title: 'Third 1.1',
  //           icon: '',
  //           class: '',
  //           label: '',
  //           labelClass: '',
  //           extralink: false,
  //           submenu: []
  //         },
  //         {
  //           path: 'javascript:void(0);',
  //           title: 'Third 1.2',
  //           icon: '',
  //           class: '',
  //           label: '',
  //           labelClass: '',
  //           extralink: false,
  //           submenu: []
  //         }
  //       ]
  //     }
  //   ]
  // }
];
