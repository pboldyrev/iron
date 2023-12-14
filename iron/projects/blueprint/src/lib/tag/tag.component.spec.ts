import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluTag } from './tag.component';

describe('BluTag', () => {
  let component: BluTag;
  let fixture: ComponentFixture<BluTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BluTag]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BluTag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
