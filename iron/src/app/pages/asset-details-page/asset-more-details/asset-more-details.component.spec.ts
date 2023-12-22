import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMoreDetailsComponent } from './asset-more-details.component';

describe('AssetMoreDetailsComponent', () => {
  let component: AssetMoreDetailsComponent;
  let fixture: ComponentFixture<AssetMoreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetMoreDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetMoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
