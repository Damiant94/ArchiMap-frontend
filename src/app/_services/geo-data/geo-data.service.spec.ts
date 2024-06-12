import { TestBed } from '@angular/core/testing';

import { GeoDataService } from './geo-data.service';

describe('GeoService', () => {
  let service: GeoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
