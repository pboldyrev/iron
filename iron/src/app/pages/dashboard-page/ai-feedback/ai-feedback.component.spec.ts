import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiFeedbackComponent } from './ai-feedback.component';

describe('AiFeedbackComponent', () => {
  let component: AiFeedbackComponent;
  let fixture: ComponentFixture<AiFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiFeedbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AiFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
