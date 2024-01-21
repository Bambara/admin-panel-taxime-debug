import { Component } from '@angular/core';
import { NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Router, RouterEvent } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // constructor(
  //   private router: Router,
  //   private spinner: NgxSpinnerService,
  // ) {
  //   router.events.subscribe((event: RouterEvent) => {
  //     this.navigationInterceptor(event)
  //   })
  // }

  // i = 0;
  // navigationInterceptor(event: RouterEvent): void {
  //   if (event instanceof NavigationStart) {
  //     this.spinner.show();
  //   }

  //   if (event instanceof NavigationEnd) {
  //     this.spinner.hide();
  //   }

  //   if (event instanceof NavigationCancel) {
  //     this.spinner.hide();
  //   }

  //   if (event instanceof NavigationError) {
  //     this.spinner.hide();
  //   }

  // }

}
