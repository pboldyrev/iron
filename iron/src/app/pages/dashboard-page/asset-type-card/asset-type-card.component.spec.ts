import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTypeCardComponent } from './asset-type-card.component';

describe('AssetTypeCardComponent', () => {
  let component: AssetTypeCardComponent;
  let fixture: ComponentFixture<AssetTypeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetTypeCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssetTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
