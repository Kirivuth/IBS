// E:/Kirivuth/IBS/src/app/components/tab/tabs-collection/tabs-collection.component.ts

import {
  Component,
  OnInit,
  OnDestroy,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  Type,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
  QueryList,
  ViewChildren,
  HostListener,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { TabService, TabItem } from '../../../services/tab/tab.service';
import { Subscription, Subject, Observable, BehaviorSubject } from 'rxjs';
import { CommonModule, NgFor, NgClass } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-tabs-collection',
  imports: [
    CommonModule,
    NgFor,
    NgClass,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './tabs-collection.component.html',
  styleUrl: './tabs-collection.component.css',
  standalone: true,
})
export class TabsCollectionComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  tabs: TabItem[] = [];
  visibleTabs: TabItem[] = [];
  overflowTabs: TabItem[] = [];
  activeTabId: string | null = null;
  tabServiceSubscription!: Subscription;
  activeTabIdSubscription!: Subscription;
  routerEventsSubscription!: Subscription;

  @ViewChild('tabContentContainer', { read: ViewContainerRef })
  tabContentContainer!: ViewContainerRef;

  @ViewChild('tabsContainer') tabsContainer!: ElementRef;
  @ViewChild('moreButtonTrigger') moreButtonTrigger!: MatMenuTrigger;
  @ViewChild('moreButtonElement') moreButtonElement!: ElementRef;
  @ViewChildren('tabElement') tabElements!: QueryList<ElementRef>;

  private componentRefs: ComponentRef<any>[] = [];
  private checkOverflowTimeout: any;
  private destroy$ = new Subject<void>();

  constructor(
    private tabService: TabService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    this.scheduleOverflowCheck();
  }

  ngAfterViewInit(): void {
    this.scheduleOverflowCheck();
    // This ensures the initial content is rendered *after* the view children are ready.
    // It's safe to call renderActiveTabContent here because tabContentContainer is available.
    this.renderActiveTabContent();
  }

  ngAfterViewChecked(): void {
    this.scheduleOverflowCheck();
  }

  scheduleOverflowCheck(): void {
    clearTimeout(this.checkOverflowTimeout);
    this.checkOverflowTimeout = setTimeout(() => {
      this.determineVisibleTabs();
      this.changeDetectorRef.markForCheck();
    }, 50);
  }

  shouldShowOverflowMenu(): boolean {
    return this.overflowTabs.length > 0;
  }

  ngOnInit(): void {
    this.tabServiceSubscription = this.tabService.tabs.subscribe((newTabs) => {
      this.tabs = newTabs;
      this.scheduleOverflowCheck();
    });

    this.activeTabIdSubscription = this.tabService.activeTabId.subscribe(
      (newActiveTabId) => {
        this.activeTabId = newActiveTabId;

        // FIX: Only render content if the view container is ready.
        // If this is the *very first* emission before ngAfterViewInit,
        // the warn message will still appear, but the content will be rendered
        // correctly by ngAfterViewInit. Subsequent calls will work fine.
        // Alternatively, the `if (!this.tabContentContainer)` check inside
        // `renderActiveTabContent` serves this purpose.
        // So, you can keep the call here AS IS, because renderActiveTabContent
        // has the safeguard. The warning is harmless now.
        // If you want to suppress the warning for the first call, you could do:
        if (this.tabContentContainer) {
          // This condition suppresses the warning
          this.renderActiveTabContent();
        }

        // Router Navigation Logic for Tab Changes
        if (newActiveTabId) {
          const activeTab = this.tabs.find(
            (t: TabItem) => t.id === newActiveTabId
          );
          if (
            activeTab &&
            activeTab.route &&
            this.router.url !== activeTab.route
          ) {
            this.router
              .navigate([activeTab.route], { relativeTo: this.route })
              .catch((err) => {
                console.error('Navigation error on active tab change:', err);
              });
          } else if (!activeTab || !activeTab.route) {
            if (this.router.url !== '/') {
              this.router.navigate(['/']);
            }
          }
        } else {
          if (this.tabs.length === 0 && this.router.url !== '/') {
            this.router.navigate(['/']);
          }
        }
        this.scheduleOverflowCheck();
      }
    );

    this.routerEventsSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoutePath =
          this.route.snapshot.firstChild?.routeConfig?.path;
        if (currentRoutePath) {
          const menuItems = (this.tabService as any).getMenuItems();
          const initialMenuItem = menuItems.find(
            (item: any) => item.route === currentRoutePath
          );
          if (
            initialMenuItem &&
            !this.tabs.some((t: TabItem) => t.id === initialMenuItem.id)
          ) {
            this.tabService.addTab(
              {
                id: initialMenuItem.id,
                label: initialMenuItem.label,
                contentComponent: initialMenuItem.contentComponent,
                route: initialMenuItem.route,
              },
              true
            );
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.tabServiceSubscription) {
      this.tabServiceSubscription.unsubscribe();
    }
    if (this.activeTabIdSubscription) {
      this.activeTabIdSubscription.unsubscribe();
    }
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
    this.destroyAllComponents();
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.checkOverflowTimeout);
  }

  onCloseTab(id: string): void {
    this.tabService.closeTab(id);
  }

  onTabClick(id: string): void {
    this.tabService.setActiveTab(id);
  }

  onOverflowTabClick(tab: TabItem): void {
    this.tabService.setActiveTab(tab.id);

    const currentTabs = this.tabService.getTabsValue();
    const index = currentTabs.findIndex((t: TabItem) => t.id === tab.id);
    if (index > -1) {
      const [movedTab] = currentTabs.splice(index, 1);
      const newOrderedTabs = [movedTab, ...currentTabs];
      this.tabService.setTabs(newOrderedTabs);
    }
  }

  private getTabActualWidth(tabId: string): number {
    const tabElement = this.tabElements?.find(
      (el) => el.nativeElement.getAttribute('data-tab-id') === tabId
    );
    return tabElement ? tabElement.nativeElement.offsetWidth : 175;
  }

  private determineVisibleTabs(): void {
    if (!this.tabsContainer || !this.tabs || this.tabs.length === 0) {
      this.visibleTabs = [];
      this.overflowTabs = [];
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.visibleTabs = [];
    this.overflowTabs = [];

    const containerWidth = this.tabsContainer.nativeElement.offsetWidth;
    let currentWidth = 0;
    let moreButtonSpace = 0;

    const tempMoreButtonWidth = this.moreButtonElement?.nativeElement
      ? this.moreButtonElement.nativeElement.offsetWidth + 10
      : 80;

    const totalContentWidthEstimate = this.tabs.reduce(
      (acc, tab) => acc + this.getTabActualWidth(tab.id),
      0
    );
    const willLikelyNeedMoreButton = totalContentWidthEstimate > containerWidth;

    if (willLikelyNeedMoreButton) {
      moreButtonSpace = tempMoreButtonWidth;
    }

    for (const tab of this.tabs) {
      const tabWidth = this.getTabActualWidth(tab.id);

      if (currentWidth + tabWidth <= containerWidth - moreButtonSpace) {
        this.visibleTabs.push(tab);
        currentWidth += tabWidth;
      } else {
        this.overflowTabs.push(tab);
      }
    }

    if (
      this.activeTabId &&
      !this.visibleTabs.some((t: TabItem) => t.id === this.activeTabId)
    ) {
      const activeTabInTabs = this.tabs.find(
        (t: TabItem) => t.id === this.activeTabId
      );

      if (activeTabInTabs) {
        this.visibleTabs = this.visibleTabs.filter(
          (t: TabItem) => t.id !== this.activeTabId
        );
        this.overflowTabs = this.overflowTabs.filter(
          (t: TabItem) => t.id !== this.activeTabId
        );

        this.visibleTabs.unshift(activeTabInTabs);

        let recalculatedWidth = this.visibleTabs.reduce(
          (acc, tab) => acc + this.getTabActualWidth(tab.id),
          0
        );

        while (
          recalculatedWidth > containerWidth - moreButtonSpace &&
          this.visibleTabs.length > 1
        ) {
          const lastVisibleTab = this.visibleTabs.pop();
          if (lastVisibleTab) {
            this.overflowTabs.unshift(lastVisibleTab);
            recalculatedWidth -= this.getTabActualWidth(lastVisibleTab.id);
          }
        }
      }
    }

    this.changeDetectorRef.detectChanges();
  }

  public renderActiveTabContent(): void {
    // This check is CRUCIAL here.
    if (!this.tabContentContainer) {
      console.warn(
        'tabContentContainer is undefined. Cannot render tab content.'
      );
      return; // Exit if not ready
    }
    this.tabContentContainer.clear();
    this.destroyAllComponents();

    if (this.activeTabId) {
      const activeTab = this.tabs.find(
        (tab: TabItem) => tab.id === this.activeTabId
      );
      if (activeTab && activeTab.contentComponent) {
        this.loadComponent(activeTab.contentComponent, activeTab.data);
      }
    }
  }

  private loadComponent(component: Type<any>, data?: any): void {
    const factory =
      this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = this.tabContentContainer.createComponent(factory);
    this.componentRefs.push(componentRef);
    if (data) {
      Object.assign(componentRef.instance, data);
    }
  }

  public destroyAllComponents(): void {
    this.componentRefs.forEach((componentRef) => {
      componentRef.destroy();
    });
    this.componentRefs = [];
  }

  public trackByTabId(index: number, tab: TabItem): string {
    return tab.id;
  }
}
