import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueHistoryComponent } from './value-history.component';

describe('ValueHistoryComponent', () => {
  let component: ValueHistoryComponent;
  let fixture: ComponentFixture<ValueHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValueHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValueHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
