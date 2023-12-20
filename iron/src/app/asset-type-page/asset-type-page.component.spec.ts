import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTypePageComponent } from './asset-type-page.component';

describe('VehiclesPageComponent', () => {
  let component: AssetTypePageComponent;
  let fixture: ComponentFixture<AssetTypePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetTypePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
