import { TestBed, inject } from '@angular/core/testing';

import { AgendaService } from './agenda.service';

describe('AgendaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgendaService]
    });
  });

  it('should ...', inject([AgendaService], (service: AgendaService) => {
    expect(service).toBeTruthy();
  }));
});
