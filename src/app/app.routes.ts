import { Routes } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { BrandComponent } from './components/brand/brand.component';

import { FrmUserComponent } from './components/user/form/frm-user/frm-user.component';
import { FrmBrandComponent } from './components/brand/form/frm-brand/frm-brand.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PosComponent } from './components/pos/pos.component';
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

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'pos',
    component: PosComponent,
  },
  {
    path: 'admin/users',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: UserComponent },
      { path: 'create', component: FrmUserComponent },
      { path: 'view/:id', component: FrmUserComponent },
    ],
  },
  {
    path: 'admin/roles',
    component: RoleComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: RoleComponent },
    ],
  },
  {
    path: 'admin/permissions',
    component: PermissionComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: PermissionComponent },
    ],
  },
  {
    path: 'customers',
    component: CustomerComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: CustomerComponent },
    ],
  },
  {
    path: 'customers/owed',
    component: CustomerOweComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: CustomerOweComponent },
    ],
  },
  {
    path: 'customers/history',
    component: CustomerHistoryComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: CustomerHistoryComponent },
    ],
  },
  {
    path: 'reports/best-sales',
    component: RptbestsaleComponent,
  },
  {
    path: 'reports/summary',
    component: RptsummaryeComponent,
  },
  {
    path: 'reports/income',
    component: RptincomeComponent,
  },
  {
    path: 'suppliers',
    component: SupplierComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: SupplierComponent },
    ],
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: InventoryComponent },
    ],
  },
  {
    path: 'settings',
    component: SettingComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: SettingComponent },
    ],
  },
  {
    path: 'brands',
    component: BrandComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: BrandComponent },
      { path: 'create', component: FrmBrandComponent },
      { path: 'view/:id', component: FrmBrandComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
