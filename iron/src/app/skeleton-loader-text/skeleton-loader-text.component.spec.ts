import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonLoaderTextComponent } from './skeleton-loader-text.component';

describe('SkeletonLoaderTextComponent', () => {
  let component: SkeletonLoaderTextComponent;
  let fixture: ComponentFixture<SkeletonLoaderTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoaderTextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SkeletonLoaderTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
