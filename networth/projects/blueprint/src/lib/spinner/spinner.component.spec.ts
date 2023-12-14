import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluSpinner } from './spinner.component';

describe('BluSpinner', () => {
  let component: BluSpinner;
  let fixture: ComponentFixture<BluSpinner>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BluSpinner],
    });
    fixture = TestBed.createComponent(BluSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
