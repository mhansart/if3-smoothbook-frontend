import { TestBed } from '@angular/core/testing';

import { InfositeService } from './infosite.service';

describe('InfositeService', () => {
  let service: InfositeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfositeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
