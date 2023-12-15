import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluLabel } from './label.component';

describe('BluLabel', () => {
  let component: BluLabel;
  let fixture: ComponentFixture<BluLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BluLabel]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BluLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
