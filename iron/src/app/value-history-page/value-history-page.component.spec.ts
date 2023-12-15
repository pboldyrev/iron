import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueHistoryPageComponent } from './value-history-page.component';

describe('ValueHistoryPageComponent', () => {
  let component: ValueHistoryPageComponent;
  let fixture: ComponentFixture<ValueHistoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValueHistoryPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValueHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
