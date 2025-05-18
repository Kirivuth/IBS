import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptbestsaleComponent } from './rptbestsale.component';

describe('RptbestsaleComponent', () => {
  let component: RptbestsaleComponent;
  let fixture: ComponentFixture<RptbestsaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RptbestsaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RptbestsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
