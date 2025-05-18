import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOweComponent } from './customer-owe.component';

describe('CustomerOweComponent', () => {
  let component: CustomerOweComponent;
  let fixture: ComponentFixture<CustomerOweComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerOweComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerOweComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
