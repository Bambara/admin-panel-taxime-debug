import { TestBed } from '@angular/core/testing';

import { PendingDriversService } from './pending-drivers.service';

describe('PendingDriversService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PendingDriversService = TestBed.get(PendingDriversService);
    expect(service).toBeTruthy();
  });
});
