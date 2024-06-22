import { TestBed } from '@angular/core/testing';

import { RouteDataProviderService } from './route-data-provider.service';

describe('RouteDataProviderService', () => {
  let service: RouteDataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteDataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
