import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluValidationFeedback } from './validation-feedback.component';

describe('BluValidationFeedback', () => {
  let component: BluValidationFeedback;
  let fixture: ComponentFixture<BluValidationFeedback>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BluValidationFeedback],
    });
    fixture = TestBed.createComponent(BluValidationFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
