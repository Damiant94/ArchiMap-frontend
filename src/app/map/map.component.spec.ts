import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideToastr } from 'ngx-toastr';
import { MapService } from '../_services/map/map.service';
import { Subject, of } from 'rxjs';
import Map from 'ol/Map';
import { ObjectsService } from '../_services/objects/objects.service';
import { ObjectCategory, ObjectDataMap } from '../_models/objectData';
import { Filters } from '../_models/filters';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mapServiceMock: MapService;
  let mapMock: Map;
  let objectsServiceMock: ObjectsService;

  beforeEach(async () => {
    mapMock = jasmine.createSpyObj<Map>('Map', {
      setTarget: undefined,
      on: undefined,
    });

    mapServiceMock = jasmine.createSpyObj<MapService>('MapService', {
      getMap: mapMock,
      createNewVectorSource: undefined,
      createOverlayForPopups: undefined,
      createMarkers: undefined,
      setPopupContainer: undefined,
      removePopupContainer: undefined,
    });
    const toggleShowMapSubject = new Subject<boolean>();
    mapServiceMock.toggleShowMapSubject = toggleShowMapSubject;

    objectsServiceMock = jasmine.createSpyObj<ObjectsService>(
      'ObjectsService',
      {
        getObjectsForMap: of(mockObjectsForMap),
      }
    );
    const filtersChangedSubject = new Subject<Filters>();
    objectsServiceMock.filtersChangedSubject = filtersChangedSubject;

    await TestBed.configureTestingModule({
      imports: [MapComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
        { provide: MapService, useValue: mapServiceMock },
        { provide: ObjectsService, useValue: objectsServiceMock },
        { provide: Map, useValue: mapMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showMap on toggleMapSubject to true', () => {
    spyOn(component, 'showMap');
    mapServiceMock.toggleShowMapSubject.next(true);
    expect(component.showMap).toHaveBeenCalled();
  });

  it('should call hideMap on toggleMapSubject to false', () => {
    spyOn(component, 'hideMap');
    mapServiceMock.toggleShowMapSubject.next(false);
    expect(component.hideMap).toHaveBeenCalled();
  });

  it('should get objects for map', () => {
    expect(objectsServiceMock.getObjectsForMap).toHaveBeenCalled();
    expect(mapServiceMock.createMarkers).toHaveBeenCalledWith(
      mockObjectsForMap
    );
  });

  it('should get objects for map 2 times when filters changed', () => {
    objectsServiceMock.filtersChangedSubject.next({
      search: '',
      category: '',
      country: '',
    });
    expect(objectsServiceMock.getObjectsForMap).toHaveBeenCalledTimes(2);
    expect(mapServiceMock.createMarkers).toHaveBeenCalledTimes(2);
  });
});

const mockObjectsForMap: ObjectDataMap[] = [
  {
    id: '123',
    category: ObjectCategory.APARTMENT,
    coordinateLonLat: [0, 0],
  },
];
