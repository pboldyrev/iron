import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueHistoryChartComponent } from './value-history-chart.component';

describe('ValueHistoryChartComponent', () => {
  let component: ValueHistoryChartComponent;
  let fixture: ComponentFixture<ValueHistoryChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValueHistoryChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValueHistoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
