import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'; // Added NavigationEnd
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TabService } from './services/tab/tab.service';
import { MenuService } from './services/menu/menu.service';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { TabsCollectionComponent } from './components/tab/tabs-collection/tabs-collection.component';
// Import all your content components for the switch statement
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
  menuServiceSubscription!: Subscription;
  @ViewChild(TabsCollectionComponent)
  tabsCollectionComponent?: TabsCollectionComponent;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _tabService: TabService,
    private _menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.isLogin = !!localStorage.getItem('token');
    this.menuServiceSubscription = this._menuService
      .getMenuItems()
      .subscribe((items) => {
        this.menuItems = items;
        // Moved initial tab creation logic to TabsCollectionComponent
        // This is good because TabsCollectionComponent knows how to react to URL changes directly.
      });

    // You can keep this subscription if you need to react to router events here
    // but it's not strictly necessary for the tab/menu sync with the new approach.
    this.routerSubscription = this._router.events.subscribe((event) => {
        // Example: If you need to update `isLogin` based on route changes (e.g., to login page)
        if (event instanceof NavigationEnd) {
            // Check if current route is login route, etc.
        }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.menuServiceSubscription) {
      this.menuServiceSubscription.unsubscribe();
    }
  }

  switchView(isSignedIn: boolean) {
    this.isLogin = isSignedIn;
    // Optionally, if login state changes, you might want to re-evaluate tabs.
    // For example, if logging out should clear all tabs.
    if (!isSignedIn) {
        this._tabService.setTabs([]); // Clear all tabs on logout
        this._tabService.setActiveTab(null);
        this._router.navigate(['/']); // Go to login/home
    }
  }

  addTab(menuItem: any): void {
    let tabId = menuItem.id;
    let tabLabel = menuItem.label;
    let contentComponent: any;
    let route = menuItem.route;

    // Ensure contentComponent is correctly assigned based on menuItem.id
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
        console.warn(`No content component defined for menu item ID: ${menuItem.id}`);
        return; // Exit if no component is mapped
    }

    this._tabService.addTab(
      {
        id: tabId,
        label: tabLabel,
        contentComponent: contentComponent, // Pass the actual component reference
        route: route,
      },
      false // isFirst should likely be false here, as it's typically user-driven addition
    );
    // setActiveTab is implicitly handled by addTab now, as it sets the added tab as active
    // this._tabService.setActiveTab(tabId);
  }

  // initializeTabsForRoutes is now handled within TabsCollectionComponent's ngOnInit
  // private initializeTabsForRoutes(): void { /* ... */ }
}