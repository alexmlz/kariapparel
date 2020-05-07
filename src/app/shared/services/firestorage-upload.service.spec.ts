import { TestBed } from '@angular/core/testing';

import { FirestorageUploadService } from './firestorage-upload.service';

describe('FirestorageUploadService', () => {
  let service: FirestorageUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestorageUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
