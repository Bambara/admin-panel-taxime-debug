//===============service=====================
// import { Injectable } from '@angular/core';
// import { SnotifyService } from 'ng-snotify';


// @Injectable({
//   providedIn: 'root'
// })
// export class ToasterService {

//   constructor(
//     private snotifyService: SnotifyService
//   ) { }

//   success() {
//     this.snotifyService.success('Example body content', {
//       timeout: 2000,
//       showProgressBar: false,
//       closeOnClick: false,
//       pauseOnHover: true
//     })
//   }
// }


//=========================module=======================

// import { CommonModule } from "@angular/common";
// import { SnotifyModule } from "ng-snotify";
// import { ToasterService } from "../shared/services/toastr.service";

// @NgModule({
//   imports: [
//     CommonModule,
//     SnotifyModule,
//     ToasterService
//   ],
//   declarations: [
//   ],
//   providers: [
//     { provide: 'SnotifyToastConfig', useValue: ToastDefaults },
//     SnotifyService,
//     ToasterService
//   ]
// })
// export class SharedModule { }


// ==========html===========

// <ng-snotify></ng-snotify>
