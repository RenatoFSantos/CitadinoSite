import { TestBed, inject } from '@angular/core/testing';

import { DbmanagerService } from './dbmanager.service';

describe('DbmanagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DbmanagerService]
    });
  });

  it('should ...', inject([DbmanagerService], (service: DbmanagerService) => {
    expect(service).toBeTruthy();
  }));
});
