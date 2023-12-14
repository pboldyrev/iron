import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHysaComponent } from './add-hysa.component';

describe('AddHysaComponent', () => {
  let component: AddHysaComponent;
  let fixture: ComponentFixture<AddHysaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHysaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHysaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
