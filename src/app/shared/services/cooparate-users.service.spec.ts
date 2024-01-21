import { TestBed } from '@angular/core/testing';

import { CooparateUsersService } from './cooparate-users.service';

describe('CooparateUsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CooparateUsersService = TestBed.get(CooparateUsersService);
    expect(service).toBeTruthy();
  });
});
