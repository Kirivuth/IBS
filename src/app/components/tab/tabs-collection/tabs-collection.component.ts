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
} from '@angular/core';
import { TabService, TabItem } from '../../../services/tab/tab.service'; // Import from the service file
import { Subscription, Subject, fromEvent, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs-collection',
  imports: [CommonModule, NgFor, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './tabs-collection.component.html',
  styleUrl: './tabs-collection.component.css',
  standalone: true,
})
export class TabsCollectionComponent implements OnInit, OnDestroy {
  tabs: TabItem[] = [];
  visibleTabs: TabItem[] = []; // Array for initially visible tabs
  overflowTabs: TabItem[] = []; // Array for tabs in the "More..." menu
  activeTabId: string | null = null;
  tabServiceSubscription!: Subscription;
  activeTabIdSubscription!: Subscription;
  @ViewChild('tabContentContainer', { read: ViewContainerRef })
  tabContentContainer!: ViewContainerRef;
  private componentRefs: ComponentRef<any>[] = [];

  @ViewChild('tabsContainer') tabsContainer!: ElementRef;
  @ViewChild('overflowMenuTrigger') overflowMenuTrigger:
    | MatMenuTrigger
    | undefined;
  public showOverflow = false;
  private destroy$ = new Subject<void>();

  @ViewChildren('tabElement') tabElements!: QueryList<ElementRef>;

  constructor(
    private tabService: TabService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tabServiceSubscription = this.tabService.tabs.subscribe((tabs) => {
      this.tabs = tabs;
      this.renderActiveTabContent();
    });

    this.activeTabIdSubscription = this.tabService.activeTabId.subscribe(
      (activeTabId) => {
        this.activeTabId = activeTabId;
        this.renderActiveTabContent();
      }
    );

    this.route.params.subscribe((params) => {
      const tabId = params['tabId'];
      if (tabId) {
        this.tabService.setActiveTab(tabId);
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
    this.destroyAllComponents();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCloseTab(id: string): void {
    this.tabService.closeTab(id);
    if (this.tabs.length <= 1) {
      this.router.navigate(['/tabs']);
    }
  }

  onTabClick(id: string): void {
    this.tabService.setActiveTab(id);
    const tab = this.tabs.find((t) => t.id === id);
    if (tab && tab.route) {
      this.router.navigate([tab.route]);
    }
  }

  private renderActiveTabContent(): void {
    if (!this.tabContentContainer) {
      return;
    }

    this.tabContentContainer.clear();
    this.destroyAllComponents();

    if (this.activeTabId) {
      const activeTab = this.tabs.find((tab) => tab.id === this.activeTabId);
      if (activeTab && activeTab.contentComponent) {
        this.loadComponent(activeTab.contentComponent, activeTab.data);
      }
    }
  }

  private loadComponent(component: Type<any>, data?: any): void {
    if (!this.tabContentContainer) {
      console.error(
        'tabContentContainer is undefined. Cannot load component.',
        component,
        data
      );
      return;
    }
    const factory =
      this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = this.tabContentContainer.createComponent(factory);
    this.componentRefs.push(componentRef);
    if (data) {
      Object.assign(componentRef.instance, data);
    }
  }

  private destroyAllComponents(): void {
    this.componentRefs.forEach((componentRef) => {
      componentRef.destroy();
    });
    this.componentRefs = [];
  }

  trackByTabId(index: number, tab: TabItem): string {
    return tab.id;
  }
}
