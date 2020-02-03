import { TestBed } from '@angular/core/testing';

import { CompanyAuthService } from './company-auth.service';

describe('CompanyAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyAuthService = TestBed.get(CompanyAuthService);
    expect(service).toBeTruthy();
  });
});
