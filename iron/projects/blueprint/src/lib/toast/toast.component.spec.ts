import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluToast } from './toast.component';

describe('BluToast', () => {
  let component: BluToast;
  let fixture: ComponentFixture<BluToast>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BluToast],
    });
    fixture = TestBed.createComponent(BluToast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
