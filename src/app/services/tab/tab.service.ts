// tab.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, BehaviorSubject, Observable } from 'rxjs'; // Ensure Observable is imported
import { takeUntil } from 'rxjs/operators';

export interface TabItem {
  id: string;
  label: string;
  contentComponent: any; // Type this more specifically if possible
  data?: any;
  route?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TabService implements OnDestroy {
  private _tabs = new BehaviorSubject<TabItem[]>(this.getStoredTabs());
  public tabs = this._tabs.asObservable(); // Exposed as Observable
  private _activeTabId = new BehaviorSubject<string | null>(
    this.getStoredActiveTabId()
  );
  public activeTabId = this._activeTabId.asObservable(); // Exposed as Observable
  private destroy$ = new Subject<void>();

  // Temporary, for demonstration. Ideally, menu items come from MenuService or config.
  // Make sure your actual menu items have 'contentComponent' properties for routing.
  private _dummyMenuItems: any[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      contentComponent: null,
    }, // Replace null with actual component
    { id: 'pos', label: 'POS', route: '/pos', contentComponent: null }, // Replace null with actual component
    { id: 'users', label: 'Users', route: '/users', contentComponent: null }, // Replace null with actual component
    // ... add all your menu items with their actual components
  ];

  constructor(private router: Router) {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects === '/') {
          if (
            !localStorage.getItem('tabs') ||
            !localStorage.getItem('activeTabId')
          ) {
            localStorage.removeItem('tabs');
            localStorage.removeItem('activeTabId');
            this._tabs.next([]);
            this._activeTabId.next(null);
          }
        }
      }
    });
  }

  getMenuItems(): any[] {
    return this._dummyMenuItems;
  }

  private getStoredTabs(): TabItem[] {
    const storedTabs = localStorage.getItem('tabs');
    try {
      const parsedTabs: TabItem[] = storedTabs ? JSON.parse(storedTabs) : [];
      return parsedTabs;
    } catch (e) {
      console.error('Failed to parse stored tabs:', e);
      return [];
    }
  }

  private getStoredActiveTabId(): string | null {
    return localStorage.getItem('activeTabId');
  }

  private storeTabs(tabs: TabItem[]): void {
    // Ensure contentComponent is not serialized if it's not JSON-serializable
    const tabsToStore = tabs.map((tab) => {
      const { contentComponent, ...rest } = tab;
      return rest;
    });
    localStorage.setItem('tabs', JSON.stringify(tabsToStore));
  }

  private storeActiveTabId(id: string | null): void {
    localStorage.setItem('activeTabId', id || ''); // Ensure null is handled as empty string
  }

  addTab(tab: TabItem, isFirst: boolean = false): void {
    const currentTabs = this._tabs.getValue(); // Access BehaviorSubject directly
    const existingTab = currentTabs.find((t) => t.id === tab.id);

    if (!existingTab) {
      let newTabs: TabItem[];
      // Ensure contentComponent is assigned when adding a new tab
      const tabToAdd: TabItem = {
        ...tab,
        contentComponent: tab.contentComponent,
      };

      if (isFirst) {
        newTabs = [tabToAdd, ...currentTabs];
      } else {
        newTabs = [...currentTabs, tabToAdd];
      }
      this._tabs.next(newTabs);
      this.storeTabs(newTabs);
      this._activeTabId.next(tab.id);
      this.storeActiveTabId(tab.id);
    } else {
      // If tab exists, update its properties (e.g., contentComponent if dynamic)
      const updatedTabs = currentTabs.map((t) =>
        t.id === tab.id ? { ...t, contentComponent: tab.contentComponent } : t
      );
      this._tabs.next(updatedTabs);
      this._activeTabId.next(tab.id);
      this.storeActiveTabId(tab.id);
    }
  }

  closeTab(id: string): void {
    const currentTabs = this._tabs.getValue(); // Access BehaviorSubject directly
    const newTabs = currentTabs.filter((tab) => tab.id !== id);
    this._tabs.next(newTabs);
    this.storeTabs(newTabs);

    if (this._activeTabId.getValue() === id) {
      // Access BehaviorSubject directly
      if (newTabs.length > 0) {
        const newActiveTabId = newTabs[0].id;
        this._activeTabId.next(newActiveTabId);
        this.storeActiveTabId(newActiveTabId);
      } else {
        this._activeTabId.next(null);
        this.storeActiveTabId(null);
      }
    }
  }

  setActiveTab(id: string | null): void {
    this._activeTabId.next(id);
    this.storeActiveTabId(id);
  }

  setTabs(tabs: TabItem[]): void {
    this._tabs.next(tabs);
    this.storeTabs(tabs);
  }

  // >>> ADD THIS NEW METHOD TO TABSERVICE <<<
  public getTabsValue(): TabItem[] {
    return this._tabs.getValue();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
