import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FirebaseAuthService} from '../../../services/firebase.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}


export const ROUTES: RouteInfo[] = [
  {path: '/home', title: 'Dashboard', icon: 'fas fa-home', class: ''},
  {path: '/list', title: 'Cryptocurrency list', icon: 'fas fa-list-alt', class: ''},
  {path: '/history', title: 'Purchase History', icon: 'fas fa-history', class: ''}
];

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router,
              public firebaseAuthService: FirebaseAuthService) {
  }

  ngOnInit() {
    this.menuItems = ROUTES;
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }

  onMenuBtnClick() {
    event.stopPropagation();
    this.isCollapsed = !this.isCollapsed;
  }

  @HostListener('document:click', ['$event'])
  private clickOut(event) {
    // hide menu
    this.isCollapsed = true;
  }
}
