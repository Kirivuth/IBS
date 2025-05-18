import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UserComponent } from '../../user/user.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'; // Import MatMenuModule

interface Tab {
  title: string;
  path: string;
  component: any;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  standalone: true,
})
export class SidebarComponent implements OnInit {

  ngOnInit(): void {
    localStorage.removeItem('activeTabPath');
    localStorage.removeItem('tabs');
  }

  @Input() menuItems: any[] = [];
  @Output() menuItemClick = new EventEmitter<any>();
  openMenus: { [key: string]: boolean } = {};

  constructor() {}

  // toggleMenu(menu: string): void {
  //  this.openMenus[menu] = !this.openMenus[menu];
  // }

  addTab(menuItem: any) {
    this.menuItemClick.emit(menuItem);
  }

  toggleMenu(menuId: string): void {
    this.openMenus = {
      ...this.openMenus,
      [menuId]: !this.openMenus[menuId],
    };
  }
}
