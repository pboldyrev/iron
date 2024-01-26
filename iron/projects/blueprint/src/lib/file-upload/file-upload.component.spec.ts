import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BluFileUpload } from './file-upload.component';

describe('BluFileUpload', () => {
  let component: BluFileUpload;
  let fixture: ComponentFixture<BluFileUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BluFileUpload]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BluFileUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
