import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsCollectionComponent } from './tabs-collection.component';

describe('TabsCollectionComponent', () => {
  let component: TabsCollectionComponent;
  let fixture: ComponentFixture<TabsCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsCollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
