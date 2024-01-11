import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualValueEntryComponent } from './manual-value-entry.component';

describe('ManualValueEntryComponent', () => {
  let component: ManualValueEntryComponent;
  let fixture: ComponentFixture<ManualValueEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualValueEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManualValueEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
