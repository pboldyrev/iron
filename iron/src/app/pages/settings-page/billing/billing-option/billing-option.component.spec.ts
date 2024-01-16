import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingOptionComponent } from './billing-option.component';

describe('BillingOptionComponent', () => {
  let component: BillingOptionComponent;
  let fixture: ComponentFixture<BillingOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingOptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
