import { TestBed, inject } from '@angular/core/testing';

import { EnderecoService } from './endereco.service';

describe('EnderecoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnderecoService]
    });
  });

  it('should ...', inject([EnderecoService], (service: EnderecoService) => {
    expect(service).toBeTruthy();
  }));
});
