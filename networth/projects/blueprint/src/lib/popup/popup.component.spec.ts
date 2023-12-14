import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluPopup } from './popup.component';

describe('BluPopup', () => {
  let component: BluPopup;
  let fixture: ComponentFixture<BluPopup>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BluPopup],
    });
    fixture = TestBed.createComponent(BluPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
