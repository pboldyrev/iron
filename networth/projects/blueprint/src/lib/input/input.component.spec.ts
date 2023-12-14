import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluInput } from './input.component';

describe('InputFieldComponent', () => {
  let component: BluInput;
  let fixture: ComponentFixture<BluInput>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BluInput],
    });
    fixture = TestBed.createComponent(BluInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
