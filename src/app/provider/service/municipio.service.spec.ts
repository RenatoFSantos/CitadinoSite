import { TestBed, inject } from '@angular/core/testing';

import { MunicipioService } from './municipio.service';

describe('MunicipioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MunicipioService]
    });
  });

  it('should ...', inject([MunicipioService], (service: MunicipioService) => {
    expect(service).toBeTruthy();
  }));
});
