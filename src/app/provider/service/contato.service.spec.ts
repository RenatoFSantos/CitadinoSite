import { TestBed, inject } from '@angular/core/testing';

import { ContatoService } from './contato.service';

describe('ContatoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContatoService]
    });
  });

  it('should ...', inject([ContatoService], (service: ContatoService) => {
    expect(service).toBeTruthy();
  }));
});
