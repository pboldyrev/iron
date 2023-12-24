import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueChangeComponent } from './value-change.component';

describe('ValueChangeComponent', () => {
  let component: ValueChangeComponent;
  let fixture: ComponentFixture<ValueChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValueChangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValueChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
