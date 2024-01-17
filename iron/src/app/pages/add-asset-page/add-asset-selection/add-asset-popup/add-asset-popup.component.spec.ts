import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetPopupComponent } from './add-asset-popup.component';

describe('AddAssetPopupComponent', () => {
  let component: AddAssetPopupComponent;
  let fixture: ComponentFixture<AddAssetPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAssetPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAssetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
