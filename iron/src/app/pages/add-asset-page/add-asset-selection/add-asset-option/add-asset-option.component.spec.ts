import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssetOptionComponent } from './add-asset-option.component';

describe('AddAssetOptionComponent', () => {
  let component: AddAssetOptionComponent;
  let fixture: ComponentFixture<AddAssetOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAssetOptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAssetOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
