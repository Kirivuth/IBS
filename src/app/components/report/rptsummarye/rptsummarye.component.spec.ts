import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptsummaryeComponent } from './rptsummarye.component';

describe('RptsummaryeComponent', () => {
  let component: RptsummaryeComponent;
  let fixture: ComponentFixture<RptsummaryeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RptsummaryeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RptsummaryeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
