import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiFeedbackPopupComponent } from './ai-feedback-popup.component';

describe('AiFeedbackPopupComponent', () => {
  let component: AiFeedbackPopupComponent;
  let fixture: ComponentFixture<AiFeedbackPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiFeedbackPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AiFeedbackPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
