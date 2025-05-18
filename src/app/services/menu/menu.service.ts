import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  getMenuItems() {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', route: '/dashboard' },
      { id: 'pos', label: 'PoS Screen', route: '/pos' },
      {
        id: 'adminTools',
        label: 'Admin Tools',
        children: [
          { id: 'users', label: 'Users', route: '/admin/users/list' },
          { id: 'roles', label: 'Roles', route: '/admin/roles/list' },
          {
            id: 'permissions',
            label: 'Permissions',
            route: '/admin/permissions/list',
          },
        ],
      },
      {
        id: 'customers',
        label: 'Customers',
        children: [
          {
            id: 'customerList',
            label: 'Customer Listing',
            route: '/customers/list',
          },
          {
            id: 'customerOwed',
            label: 'Customer Owed',
            route: '/customers/owed/list',
          },
          {
            id: 'customerHistory',
            label: 'Customer History',
            route: '/customers/history/list',
          },
        ],
      },
      {
        id: 'reports',
        label: 'Reports',
        children: [
          {
            id: 'bestSales',
            label: 'Best Sales',
            route: '/reports/best-sales',
          },
          {
            id: 'summaryReport',
            label: 'Summary Report',
            route: '/reports/summary',
          },
          {
            id: 'incomeReport',
            label: 'Income Report',
            route: '/reports/income',
          },
        ],
      },
      { id: 'suppliers', label: 'Suppliers', route: '/suppliers/list' },
      { id: 'inventory', label: 'Inventory', route: '/inventory/list' },
      { id: 'settings', label: 'Settings', route: '/settings/list' },
    ];
    return of(menuItems);
  }
}
