import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluBanner } from './banner.component';

describe('BluBanner', () => {
  let component: BluBanner;
  let fixture: ComponentFixture<BluBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BluBanner]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BluBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
