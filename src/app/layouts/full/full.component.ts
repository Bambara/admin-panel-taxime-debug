import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Role } from '../../enums/role.enum';
import { WebsocketService } from '../../shared/services/websocket.service';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit {
  color = 'purpledark';
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;

  public innerWidth: any;

  public config: PerfectScrollbarConfigInterface = {};
  public companyCode = localStorage.getItem('companyCode');
  adminRole: string = localStorage.getItem('role');
  roleEnum = Role;

  constructor(
    public router: Router,
    private wsService: WebsocketService ) {}

  ngOnInit() {
    if (this.router.url === '/') {
      this.router.navigate(['/dashboard']);
    }
    this.handleLayout();
    this.socket();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleLayout();
  }

  toggleSidebar() {
    this.showMinisidebar = !this.showMinisidebar;
  }

  handleLayout() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.showMinisidebar = true;
    } else {
      this.showMinisidebar = false;
    }
  }

  socket(){
    this.wsService.socketHandle();
  }
}
