import { TestBed } from '@angular/core/testing';

import { ObjectsService } from './objects.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideToastr } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { mockObject } from '../../object-details/object-details.component.spec';

describe('ObjectsService', () => {
  let service: ObjectsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
      ],
      teardown: { destroyAfterEach: false },
    });
    service = TestBed.inject(ObjectsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should setNextPage work', () => {
    service.page = 1;
    service.setNextPage();
    expect(service.page).toBe(2);
  });

  it('should resetPage work', () => {
    service.page = 3;
    service.resetPage();
    expect(service.page).toBe(1);
  });

  it('getObjects should send get', () => {
    service.setFilters({ search: '', category: '', country: '' });
    service.page = 2;
    service.getObjects().subscribe((o) => {
      expect(o).toBeTruthy();
    });
    const req = httpTestingController.expectOne(
      `${environment.urlApi}/feed/get-objects?page=2`
    );
    expect(req.request.method).toBe('GET');
  });

  it('getObjects should send get with filters', () => {
    service.setFilters({ search: 'abc', category: 'def', country: 'ghi' });
    service.page = 2;
    service.getObjects().subscribe((o) => {
      expect(o).toBeTruthy();
    });
    const req = httpTestingController.expectOne(
      `${environment.urlApi}/feed/get-objects?querySearch=abc&category=def&country=ghi&page=2`
    );
    expect(req.request.method).toBe('GET');
  });

  it('getObjectsForMap should send get', () => {
    service.setFilters({ search: '', category: '', country: '' });
    service.page = 2;
    service.getObjects().subscribe((o) => {
      expect(o).toBeTruthy();
    });
    const req = httpTestingController.expectOne(
      `${environment.urlApi}/feed/get-objects?page=2`
    );
    expect(req.request.method).toBe('GET');
  });

  it('getObjectsForMap should send get with filters', () => {
    service.setFilters({ search: 'abc', category: 'def', country: 'ghi' });
    service.getObjectsForMap().subscribe((o) => {
      expect(o).toBeTruthy();
    });
    const req = httpTestingController.expectOne(
      `${environment.urlApi}/feed/get-objects-for-map?querySearch=abc&category=def&country=ghi`
    );
    expect(req.request.method).toBe('GET');
  });

  it('getObjectById should send get', () => {
    service.getObjectById('objectid').subscribe((o) => {
      expect(o).toBeTruthy();
    });
    const req = httpTestingController.expectOne(
      `${environment.urlApi}/feed/get-object/objectid`
    );
    expect(req.request.method).toBe('GET');
  });

  it('getCountries should send get', () => {
    service.getCountries().subscribe((o) => {
      expect(o).toBeTruthy();
    });
    const req = httpTestingController.expectOne(
      `${environment.urlApi}/feed/get-countries`
    );
    expect(req.request.method).toBe('GET');
  });

  it('addNewObject should send post', () => {
    service.addNewObject(mockObject);

    const req = httpTestingController.expectOne(
      `${environment.urlApi}/feed/add-object/`
    );
    expect(req.request.method).toBe('POST');
  });
});
