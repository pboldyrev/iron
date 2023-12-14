import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluText } from './text.component';

describe('BluText', () => {
  let component: BluText;
  let fixture: ComponentFixture<BluText>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BluText],
    });
    fixture = TestBed.createComponent(BluText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
