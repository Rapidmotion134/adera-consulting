import { TestBed } from '@angular/core/testing';

import { InMemoryFileUploadService } from './in-memory-file-upload.service';

describe('InMemoryFileUploadService', () => {
  let service: InMemoryFileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemoryFileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
