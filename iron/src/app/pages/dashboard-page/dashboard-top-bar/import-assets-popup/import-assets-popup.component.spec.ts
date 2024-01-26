import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAssetsPopupComponent } from './import-assets-popup.component';

describe('ImportAssetsPopupComponent', () => {
  let component: ImportAssetsPopupComponent;
  let fixture: ComponentFixture<ImportAssetsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportAssetsPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportAssetsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
