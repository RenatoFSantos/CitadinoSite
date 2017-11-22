import { TestBed, inject } from '@angular/core/testing';

import { PlanoService } from './plano.service';

describe('PlanoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanoService]
    });
  });

  it('should ...', inject([PlanoService], (service: PlanoService) => {
    expect(service).toBeTruthy();
  }));
});
