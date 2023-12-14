import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluModal } from './modal.component';

describe('ModalComponent', () => {
  let component: BluModal;
  let fixture: ComponentFixture<BluModal>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BluModal]
    });
    fixture = TestBed.createComponent(BluModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
