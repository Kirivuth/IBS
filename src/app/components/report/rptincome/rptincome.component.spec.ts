import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptincomeComponent } from './rptincome.component';

describe('RptincomeComponent', () => {
  let component: RptincomeComponent;
  let fixture: ComponentFixture<RptincomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RptincomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RptincomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
