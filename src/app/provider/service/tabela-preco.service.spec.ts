import { TestBed, inject } from '@angular/core/testing';

import { TabelaPrecoService } from './tabela-preco.service';

describe('TabelaPrecoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabelaPrecoService]
    });
  });

  it('should ...', inject([TabelaPrecoService], (service: TabelaPrecoService) => {
    expect(service).toBeTruthy();
  }));
});
