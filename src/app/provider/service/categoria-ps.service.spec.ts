import { TestBed, inject } from '@angular/core/testing';

import { CategoriaPsService } from './categoria-ps.service';

describe('CategoriaPsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoriaPsService]
    });
  });

  it('should ...', inject([CategoriaPsService], (service: CategoriaPsService) => {
    expect(service).toBeTruthy();
  }));
});
