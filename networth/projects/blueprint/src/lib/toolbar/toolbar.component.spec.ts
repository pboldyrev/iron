import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluToolbar } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: BluToolbar;
  let fixture: ComponentFixture<BluToolbar>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BluToolbar],
    });
    fixture = TestBed.createComponent(BluToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
