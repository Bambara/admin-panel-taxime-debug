import { TestBed } from '@angular/core/testing';

import { ApprovedVehicleService } from './approved-vehicle.service';

describe('ApprovedVehicleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApprovedVehicleService = TestBed.get(ApprovedVehicleService);
    expect(service).toBeTruthy();
  });
});
