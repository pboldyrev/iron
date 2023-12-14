import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BluButton } from './button.component';

describe('ButtonComponent', () => {
  let component: BluButton;
  let fixture: ComponentFixture<BluButton>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BluButton],
    });
    fixture = TestBed.createComponent(BluButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
