import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TabService } from './services/tab/tab.service';
import { MenuService } from './services/menu/menu.service';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { TabsCollectionComponent } from './components/tab/tabs-collection/tabs-collection.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PosComponent } from './components/pos/pos.component';
import { UserComponent } from './components/user/user.component';
import { RoleComponent } from './components/role/role.component';
import { PermissionComponent } from './components/permission/permission.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerOweComponent } from './components/customer-owe/customer-owe.component';
import { CustomerHistoryComponent } from './components/customer-history/customer-history.component';
import { RptbestsaleComponent } from './components/report/rptbestsale/rptbestsale.component';
import { RptsummaryeComponent } from './components/report/rptsummarye/rptsummarye.component';
import { RptincomeComponent } from './components/report/rptincome/rptincome.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { SettingComponent } from './components/setting/setting.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    TabsCollectionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'IBS';
  isLogin = false;
  menuItems: any[] = [];
  routerSubscription!: Subscription;
  menuServiceSubscription!: Subscription; // To unsubscribe from MenuService
  @ViewChild(TabsCollectionComponent)
  tabsCollectionComponent?: TabsCollectionComponent; // Make it optional with ?

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _tabService: TabService,
    private _menuService: MenuService // Inject MenuService
  ) {}

  ngOnInit(): void {
    this.isLogin = !!localStorage.getItem('token');
    this.menuServiceSubscription = this._menuService
      .getMenuItems()
      .subscribe((items) => {
        this.menuItems = items;
        this.initializeTabsForRoutes();
      });

    this.routerSubscription = this._router.events.subscribe((event) => {
      // Listen for route changes if needed,  Good practice to have it, even if empty
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.menuServiceSubscription) {
      this.menuServiceSubscription.unsubscribe(); // Unsubscribe here
    }
  }

  switchView(isSignedIn: boolean) {
    this.isLogin = isSignedIn;
  }

  addTab(menuItem: any): void {
    let tabId = menuItem.id;
    let tabLabel = menuItem.label;
    let contentComponent: any;
    let route = menuItem.route;

    switch (menuItem.id) {
      case 'dashboard':
        contentComponent = DashboardComponent;
        break;
      case 'pos':
        contentComponent = PosComponent;
        break;
      case 'users':
        contentComponent = UserComponent;
        break;
      case 'roles':
        contentComponent = RoleComponent;
        break;
      case 'permissions':
        contentComponent = PermissionComponent;
        break;
      case 'customerList':
        contentComponent = CustomerComponent;
        break;
      case 'customerOwed':
        contentComponent = CustomerOweComponent;
        break;
      case 'customerHistory':
        contentComponent = CustomerHistoryComponent;
        break;
      case 'bestSales':
        contentComponent = RptbestsaleComponent;
        break;
      case 'summaryReport':
        contentComponent = RptsummaryeComponent;
        break;

      case 'incomeReport':
        contentComponent = RptincomeComponent;
        break;

      case 'suppliers':
        contentComponent = SupplierComponent;
        break;

      case 'inventory':
        contentComponent = InventoryComponent;
        break;

      case 'settings':
        contentComponent = SettingComponent;
        break;
      default:
        return;
    }

    this._tabService.addTab({
      id: tabId,
      label: tabLabel,
      contentComponent: contentComponent,
      route: route,
    });
    this._tabService.setActiveTab(tabId); // Add this line to switch to the new tab.
  }

  private initializeTabsForRoutes(): void {
    const currentRoute = this._route.snapshot.firstChild?.routeConfig?.path;
    if (currentRoute) {
      const initialMenuItem = this.menuItems.find(
        (item) => item.route === currentRoute
      );
      if (initialMenuItem) {
        this.addTab(initialMenuItem);
      }
    }
  }
}
