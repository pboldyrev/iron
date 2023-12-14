import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCdComponent } from './add-cd.component';

describe('AddCdComponent', () => {
  let component: AddCdComponent;
  let fixture: ComponentFixture<AddCdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
