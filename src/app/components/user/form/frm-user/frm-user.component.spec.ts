import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrmUserComponent } from './frm-user.component';

describe('FrmUserComponent', () => {
  let component: FrmUserComponent;
  let fixture: ComponentFixture<FrmUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrmUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrmUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
