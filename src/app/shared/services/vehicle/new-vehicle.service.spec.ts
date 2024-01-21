import { TestBed } from '@angular/core/testing';

import { NewVehicleService } from './new-vehicle.service';

describe('NewVehicleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewVehicleService = TestBed.get(NewVehicleService);
    expect(service).toBeTruthy();
  });
});
