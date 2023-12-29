import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomFormComponent } from './add-custom-form.component';

describe('AddCustomFormComponent', () => {
  let component: AddCustomFormComponent;
  let fixture: ComponentFixture<AddCustomFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCustomFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCustomFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
