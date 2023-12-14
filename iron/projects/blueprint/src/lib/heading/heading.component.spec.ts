import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluHeading } from './heading.component';

describe('HeadingComponent', () => {
  let component: BluHeading;
  let fixture: ComponentFixture<BluHeading>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BluHeading],
    });
    fixture = TestBed.createComponent(BluHeading);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
