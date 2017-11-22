import { TestBed, inject } from '@angular/core/testing';

import { VitrineService } from './vitrine.service';

describe('VitrineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VitrineService]
    });
  });

  it('should ...', inject([VitrineService], (service: VitrineService) => {
    expect(service).toBeTruthy();
  }));
});
