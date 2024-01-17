import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetSelectionComponent } from './add-asset-selection.component';

describe('AddAssetComponent', () => {
  let component: AddAssetSelectionComponent;
  let fixture: ComponentFixture<AddAssetSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAssetSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAssetSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
