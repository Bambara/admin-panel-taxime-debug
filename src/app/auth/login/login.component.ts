import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../../shared/services/login.service';
import {TokenPayload} from '../../shared/model/tokenPayload';
// import { Injectable } from '@angular/core';
import {SnotifyService} from 'ng-snotify';
// import { from } from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    password: string = '';
    username: string = '';
    loginform = true;
    recoverform = false;

    constructor(
        public router: Router,
        public loginService: LoginService,
        private snotifyService: SnotifyService,
        private spinner: NgxSpinnerService,
    ) {
    }

    ngOnInit() {
    }

    showRecoverForm() {
        this.loginform = !this.loginform;
        this.recoverform = !this.recoverform;
    }

    login() {
        this.spinner.show();
        var credentials: TokenPayload = {
            email: this.username,
            password: this.password
        };
        this.loginService.login(credentials).subscribe(
            (data) => {
                this.spinner.hide();
                if (localStorage.getItem('role') != 'agent') {
                    this.router.navigateByUrl('dashboard');
                } else if (localStorage.getItem('companyCode')) {
                    this.router.navigateByUrl('dashboard');
                } else {
                    this.error(`No company found for agent ${localStorage.getItem('name')}`);
                }
            },
            err => {
                this.spinner.hide();
                // if(err)
                this.error(err.error.details);
                console.error(err);
            }
        );
    }

    success(msg) {
        this.snotifyService.success(msg, {
            timeout: 1000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            position: 'rightTop'
        });
    }

    error(msg) {
        this.snotifyService.error(msg, {
            timeout: 2000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            position: 'rightTop'
        });
    }

    info(msg) {
        this.snotifyService.info(msg, {
            timeout: 2000,
            showProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            position: 'rightTop'
        });
    }
}
