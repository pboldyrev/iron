import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluLink } from './link.component';

describe('BluLink', () => {
  let component: BluLink;
  let fixture: ComponentFixture<BluLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BluLink]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BluLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
