import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmBrandComponent } from './frm-brand.component';

describe('FrmBrandComponent', () => {
  let component: FrmBrandComponent;
  let fixture: ComponentFixture<FrmBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrmBrandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrmBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
