import { TestBed } from '@angular/core/testing';

import { ModalImageService } from './modal-image.service';

describe('ModalImageService', () => {
  let service: ModalImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
