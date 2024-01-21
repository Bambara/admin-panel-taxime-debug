import { Component, AfterViewInit, EventEmitter, Output, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { WebsocketService } from '../services/websocket.service';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { from } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit, OnInit {
    @Output() toggleSidebar = new EventEmitter<void>();

    public config: PerfectScrollbarConfigInterface = {};

    constructor(
        private modalService: NgbModal,
        public loginService: LoginService,
        public wsService: WebsocketService
    ) { }

    name;
    userId;
    notificationCount;
    companyCode;
    companyName;
    role;


    public showSearch = false;
    // public notifications: object[];
    msg: any;

    // This is for Notifications
    public notifications: object[] = [
        {
            round: 'round-danger',
            icon: 'ti-link',
            title: localStorage.getItem('enableDriversCount'),
        }
    ];


    // channel = new BroadcastChannel('NotificationChannel');

    // notificationChannel(){
    //     this.channel.postMessage({logout : true});
    // }


    ngOnInit() {
        
        this.name = localStorage.getItem('name');
        this.userId = localStorage.getItem('userId');
        this.companyCode = localStorage.getItem('companyCode');
        this.companyName = localStorage.getItem('companyName');
        this.role = localStorage.getItem('role');

        // this.channel.onmessage = function(e) {
        // if(e.data.count){
        //   this.setCount()
        //   // this.notifications[0]['title']= localStorage.getItem('enableDriversCount');
        // }
        
        // }
        setInterval(() => {
            
            //console.log("pending driver count get from socket");
            
            /* call socket service function */
            //this.wsService.socketHandle();
            this.notifications[0]['title'] = localStorage.getItem('enableDriversCount');
            this.notificationCount = parseInt(localStorage.getItem('enableDriversCount'));

            //console.log("notifications count pending "+this.notificationCount);

        }, 5000);
    }


    setCount(){}

    // This is for Mymessages
    mymessages: Object[] = [
        {
        useravatar: 'assets/images/users/1.jpg',
        status: 'online',
        from: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:30 AM'
        },
        {
        useravatar: 'assets/images/users/2.jpg',
        status: 'busy',
        from: 'Sonu Nigam',
        subject: 'I have sung a song! See you at',
        time: '9:10 AM'
        },
        {
        useravatar: 'assets/images/users/3.jpg',
        status: 'away',
        from: 'Arijit Sinh',
        subject: 'I am a singer!',
        time: '9:08 AM'
        },
        {
        useravatar: 'assets/images/users/4.jpg',
        status: 'offline',
        from: 'Pavan kumar',
        subject: 'Just see the my admin!',
        time: '9:00 AM'
        }
    ];

    logout() {
        localStorage.clear();
        this.loginService.logout();
    }
    ngAfterViewInit() { }
}
