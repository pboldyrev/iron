import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluPill } from './pill.component';

describe('BluPill', () => {
  let component: BluPill;
  let fixture: ComponentFixture<BluPill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BluPill]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BluPill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
