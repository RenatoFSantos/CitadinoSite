import { TestBed, inject } from '@angular/core/testing';

import { AnuncioService } from './anuncio.service';

describe('AnuncioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnuncioService]
    });
  });

  it('should ...', inject([AnuncioService], (service: AnuncioService) => {
    expect(service).toBeTruthy();
  }));
});
