import { TestBed, inject } from '@angular/core/testing';

import { DescritorService } from './descritor.service';

describe('DescritorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DescritorService]
    });
  });

  it('should ...', inject([DescritorService], (service: DescritorService) => {
    expect(service).toBeTruthy();
  }));
});
