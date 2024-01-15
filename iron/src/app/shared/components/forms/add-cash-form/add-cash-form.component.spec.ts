import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCashFormComponent } from './add-cash-form.component';

describe('AddCustomFormComponent', () => {
  let component: AddCashFormComponent;
  let fixture: ComponentFixture<AddCashFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCashFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCashFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
