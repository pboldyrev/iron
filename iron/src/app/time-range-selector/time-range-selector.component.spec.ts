import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeSelectorComponent } from './time-range-selector.component';

describe('TimeRangeSelectorComponent', () => {
  let component: TimeRangeSelectorComponent;
  let fixture: ComponentFixture<TimeRangeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeRangeSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeRangeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
