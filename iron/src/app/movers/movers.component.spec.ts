import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoversComponent } from './movers.component';

describe('MoversComponent', () => {
  let component: MoversComponent;
  let fixture: ComponentFixture<MoversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoversComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
