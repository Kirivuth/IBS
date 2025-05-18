import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewChecked, // Import AfterViewChecked
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserComponent } from '../../user/user.component';

interface Tab {
  title: string;
  path: string;
  component: any;
}

@Component({
  selector: 'app-content',
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
  standalone: true,
})
export class ContentComponent
  //implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked
{
 /*
  @ViewChild('tabContentContainer', { read: ViewContainerRef })
  tabContentContainer!: ViewContainerRef;
  activeComponentRef: ComponentRef<any> | null = null;

  @ViewChild('tabsHeader') tabsHeaderRef!: ElementRef;
  dragging = false;
  startX!: number;
  scrollLeft!: number;
  private dragInitialized = false;

  tabs: Tab[] = [];
  activeTabPath: string | null = null;
  openMenus: { [key: string]: boolean } = {};
  private ngUnsubscribe = new Subject<void>();
  private viewInitialized = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event) => {
        if (event instanceof NavigationEnd && this.viewInitialized) {
          this.handleNavigationEnd(event);
        }
      });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedTabs = localStorage.getItem('tabs');
      const savedActiveTab = localStorage.getItem('activeTabPath');

      if (savedTabs) {
        this.tabs = JSON.parse(savedTabs);
      }

      if (savedActiveTab) {
        this.activeTabPath = savedActiveTab;
        this.router.navigate([savedActiveTab]);
      }
      // else if (this.tabs.length === 0) {
      //   const dashboardTab: Tab = {
      //     title: 'Dashboard',
      //     path: '/dashboard',
      //     component: this.DashboardComponent,
      //   };
      //   this.tabs.push(dashboardTab);
      //   this.activeTabPath = dashboardTab.path;
      //   this.router.navigate([dashboardTab.path]);
      //   this.saveTabsToStorage();
      // }
      else if (this.tabs.length > 0 && !this.activeTabPath) {
        this.activeTabPath = this.tabs[0].path;
        this.router.navigate([this.activeTabPath]);
      }
      this.cdr.detectChanges(); // Ensure initial view reflects loaded state
    }
  }
  
  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.loadTabContent();
  }

  ngAfterViewChecked(): void {
    if (
      isPlatformBrowser(this.platformId) &&
      this.tabsHeaderRef &&
      !this.dragInitialized
    ) {
      this.initializeDragLogic();
      this.dragInitialized = true;
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  handleNavigationEnd(event: NavigationEnd) {
    const currentTab = this.tabs.find(
      (tab) => tab.path === event.urlAfterRedirects
    );
    if (currentTab) {
      this.activeTabPath = currentTab.path;
      this.loadTabContent();
      this.cdr.detectChanges();
    } else if (!this.activeTabPath && this.tabs.length > 0) {
      this.activeTabPath = this.tabs[0].path;
      this.loadTabContent();
      this.cdr.detectChanges();
    } else if (this.tabs.length === 0) {
      this.activeTabPath = null;
      this.loadTabContent();
      this.cdr.detectChanges();
    }
  }

  loadTabContent() {
    if (!this.tabContentContainer) {
      console.warn('loadTabContent: tabContentContainer is not yet available.');
      return;
    }
    this.tabContentContainer.clear();
    this.activeComponentRef = null;
    if (this.activeTabPath) {
      const activeTab = this.tabs.find(
        (tab) => tab.path === this.activeTabPath
      );
      if (activeTab) {
        this.activeComponentRef = this.tabContentContainer.createComponent(
          activeTab.component
        );
        if (
          activeTab.path === '/admin/users/list' &&
          this.activeComponentRef.instance instanceof UserComponent
        ) {
          const userComponentInstance = this.activeComponentRef.instance;
          // userComponentInstance.createNewTab
          //   .pipe(takeUntil(this.ngUnsubscribe))
          //   .subscribe((newTab) => {
          //     console.log('createNewTab received:', newTab);
          //     this.openTab(newTab.title, newTab.path, newTab.component);
          //   });
          // userComponentInstance.viewItemTab
          //   .pipe(takeUntil(this.ngUnsubscribe))
          //   .subscribe((viewTab) => {
          //     console.log('viewItem received in MainLayout:', viewTab);
          //     this.openTab(viewTab.title, viewTab.path, viewTab.component);
          //   });
        }
      } else {
        console.warn(
          'loadTabContent: No active tab found for path:',
          this.activeTabPath
        );
      }
    } else {
      // console.log('loadTabContent: No active tab, container cleared.');
    }
  }

  openTab(title: string, path: string, component: any) {
    const existingTab = this.tabs.find((tab) => tab.path === path);
    if (existingTab) {
      this.activeTabPath = path;
    } else {
      this.tabs.unshift({ title, path, component });
      this.activeTabPath = path;
    }
    this.saveTabsToStorage();
    this.router.navigate([path]).then(() => {
      this.loadTabContent();
      this.cdr.detectChanges();
    });
  }

  closeTab(tabToRemove: Tab) {
    const indexToRemove = this.tabs.findIndex(
      (t) => t.path === tabToRemove.path
    );
    if (indexToRemove !== -1) {
      this.tabs.splice(indexToRemove, 1);

      if (this.tabs.length > 0) {
        // Set the first tab as active after closing
        this.activeTabPath = this.tabs[0].path;
        this.router
          .navigate([this.activeTabPath])
          .then(() => this.cdr.detectChanges()); // Trigger change detection after navigation
      } else {
        this.activeTabPath = null;
        this.router.navigate(['']).then(() => this.cdr.detectChanges()); // Navigate to a default route if no tabs left
      }
      this.saveTabsToStorage();
      this.cdr.detectChanges(); // Trigger change detection after closing
    }
  }

  logTabClick(tab: Tab) {
    this.selectTab(tab);
  }

  logCloseClick(tab: Tab, event: MouseEvent) {
    this.closeTab(tab);
    event.stopPropagation();
  }

  selectTab(tab: Tab) {
    if (this.activeTabPath !== tab.path) {
      this.activeTabPath = tab.path;
      this.router.navigate([tab.path]).then(() => this.cdr.detectChanges()); // Trigger change detection after navigation
      this.saveTabsToStorage();
      this.cdr.detectChanges(); // Trigger change detection after selecting
    }
  }

  private saveTabsToStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('tabs', JSON.stringify(this.tabs));
      localStorage.setItem('activeTabPath', this.activeTabPath || '');
    }
  }

  private initializeDragLogic(): void {
    const tabsHeader = this.tabsHeaderRef.nativeElement;
    let isDragging = false;
    let startX: number;
    let initialScrollLeft: number;

    const mouseMove$ = fromEvent<MouseEvent>(tabsHeader, 'mousemove').pipe(
      debounceTime(10),
      takeUntil(this.ngUnsubscribe)
    );

    fromEvent<MouseEvent>(tabsHeader, 'mousedown')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((e) => {
        isDragging = true;
        startX = e.pageX - tabsHeader.offsetLeft;
        initialScrollLeft = tabsHeader.scrollLeft;
        tabsHeader.style.cursor = 'grab';
        e.preventDefault();
      });

    mouseMove$.subscribe((e) => {
      if (isDragging) {
        const currentX = e.pageX - tabsHeader.offsetLeft;
        const walk = currentX - startX;
        tabsHeader.scrollLeft = initialScrollLeft - walk;
      }
    });

    fromEvent(window, 'mouseup')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        if (isDragging) {
          isDragging = false;
          tabsHeader.style.cursor = 'default';
        }
      });

    const tabs = tabsHeader.querySelectorAll('.tab') as NodeListOf<HTMLElement>;
    tabs.forEach((tabElement: HTMLElement) => {
      fromEvent<DragEvent>(tabElement, 'dragstart')
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((dragEvent) => {
          dragEvent.preventDefault();
        });
    });
  }
*/

}
