import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluSelect } from './select.component';

describe('BluSelect', () => {
  let component: BluSelect;
  let fixture: ComponentFixture<BluSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BluSelect]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BluSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
