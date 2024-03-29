import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetDetailsPageComponent } from './asset-details-page.component';

describe('AssetDetailsPageComponent', () => {
  let component: AssetDetailsPageComponent;
  let fixture: ComponentFixture<AssetDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetDetailsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
