import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachFilesComponent } from './attach-files.component';

describe('AttachFilesComponent', () => {
  let component: AttachFilesComponent;
  let fixture: ComponentFixture<AttachFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachFilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttachFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
