import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetPageComponent } from './add-asset-page.component';

describe('AddVehicleComponent', () => {
  let component: AddAssetPageComponent;
  let fixture: ComponentFixture<AddAssetPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAssetPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAssetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
