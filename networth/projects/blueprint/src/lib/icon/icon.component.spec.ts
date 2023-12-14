import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluIcon } from './icon.component';

describe('BluIcon', () => {
  let component: BluIcon;
  let fixture: ComponentFixture<BluIcon>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BluIcon],
    });
    fixture = TestBed.createComponent(BluIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
