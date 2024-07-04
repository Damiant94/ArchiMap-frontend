import { TestBed } from '@angular/core/testing';

import { GeoDataService } from './geo-data.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

describe('GeoService', () => {
  let service: GeoDataService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [[provideHttpClient(), provideHttpClientTesting()]],
    });
    service = TestBed.inject(GeoDataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getGeoData should send get', () => {
    service.getGeoData([1,2]).subscribe((o) => {
      expect(o).toBeTruthy();
    });
    const req = httpTestingController.expectOne(
      `https://nominatim.openstreetmap.org/reverse?lat=1&lon=2&format=json`
    );
    expect(req.request.method).toBe('GET');
  });
  
  it('getAddresses should send get', () => {
    service.getAddresses("address").subscribe((o) => {
      expect(o).toBeTruthy();
    });
    const req = httpTestingController.expectOne(
      `https://nominatim.openstreetmap.org/search?q=address&format=json&accept-language=en`
    );
    expect(req.request.method).toBe('GET');
  });
});
