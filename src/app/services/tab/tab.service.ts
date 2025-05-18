import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface TabItem {
  id: string;
  label: string;
  contentComponent: any;
  data?: any;
  route?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TabService implements OnDestroy {
  private _tabs = new BehaviorSubject<TabItem[]>([]);
  public tabs = this._tabs.asObservable();
  private _activeTabId = new BehaviorSubject<string | null>(null);
  public activeTabId = this._activeTabId.asObservable();
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {
    this._tabs.next(this.getStoredTabs());
    this._activeTabId.next(this.getStoredActiveTabId());

    // Clear storage only on full page refresh (NavigationEnd)
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if it's the initial navigation (page load)
        if (event.url === '/') {
          // Or some other condition to identify initial load
          localStorage.removeItem('tabs');
          localStorage.removeItem('activeTabId');
          this._tabs.next([]);
          this._activeTabId.next(null);
        }
      }
    });
  }

  private getStoredTabs(): TabItem[] {
    const storedTabs = localStorage.getItem('tabs');
    return storedTabs ? JSON.parse(storedTabs) : [];
  }

  private getStoredActiveTabId(): string | null {
    return localStorage.getItem('activeTabId');
  }

  private storeTabs(tabs: TabItem[]): void {
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }

  private storeActiveTabId(id: string | null): void {
    localStorage.setItem('activeTabId', id || '');
  }

  addTab(tab: TabItem): void {
    const currentTabs = this._tabs.getValue();
    const existingTab = currentTabs.find((t) => t.id === tab.id);
    if (!existingTab) {
      const newTabs = [...currentTabs, tab];
      this._tabs.next(newTabs);
      this.storeTabs(newTabs);
    }
    this._activeTabId.next(tab.id); //set active tab
  }

  closeTab(id: string): void {
    const currentTabs = this._tabs.getValue();
    const newTabs = currentTabs.filter((tab) => tab.id !== id);
    this._tabs.next(newTabs);
    this.storeTabs(newTabs);

    if (newTabs.length > 0) {
      const newActiveTabId = newTabs[0].id;
      this._activeTabId.next(newActiveTabId);
      this.storeActiveTabId(newActiveTabId);
    } else {
      this._activeTabId.next(null);
      this.storeActiveTabId(null);
    }
  }

  setActiveTab(id: string): void {
    this._activeTabId.next(id);
    this.storeActiveTabId(id);
  }

  setTabs(tabs: TabItem[]): void {
    this._tabs.next(tabs);
    this.storeTabs(tabs);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
