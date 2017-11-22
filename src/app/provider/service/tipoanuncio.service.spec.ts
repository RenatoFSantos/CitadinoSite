import { TestBed, inject } from '@angular/core/testing';

import { TipoAnuncioService } from './tipoanuncio.service';

describe('TipoAnuncioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoAnuncioService]
    });
  });

  it('should ...', inject([TipoAnuncioService], (service: TipoAnuncioService) => {
    expect(service).toBeTruthy();
  }));
});
