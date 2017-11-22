import { TestBed, inject } from '@angular/core/testing';

import { SmartsiteService } from './smartsite.service';

describe('SmartsiteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmartsiteService]
    });
  });

  it('should ...', inject([SmartsiteService], (service: SmartsiteService) => {
    expect(service).toBeTruthy();
  }));
});
