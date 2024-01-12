import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureProjectionComponent } from './future-projection.component';

describe('FutureProjectionComponent', () => {
  let component: FutureProjectionComponent;
  let fixture: ComponentFixture<FutureProjectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FutureProjectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FutureProjectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
