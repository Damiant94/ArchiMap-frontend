import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectDetailsComponent } from './object-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideToastr } from 'ngx-toastr';
import { ObjectsService } from '../_services/objects/objects.service';
import { ObjectCategory, ObjectData } from '../_models/objectData';
import { MapService } from '../_services/map/map.service';

describe('ObjectDetailsComponent', () => {
  let component: ObjectDetailsComponent;
  let fixture: ComponentFixture<ObjectDetailsComponent>;
  let objectsServiceMock: ObjectsService;
  let mapServiceMock: MapService;
  let routerMock: Router;

  beforeEach(async () => {
    objectsServiceMock = jasmine.createSpyObj<ObjectsService>(
      'ObjectsService',
      {
        getObjectById: of(mockObject),
      }
    );

    mapServiceMock = jasmine.createSpyObj<MapService>('MapService', {
      onAnimateToView: undefined,
      toggleShowMap: undefined,
      getObjectCategoryIconUrl: undefined,
    });

    routerMock = jasmine.createSpyObj<Router>('Router', {
      navigate: undefined,
    });

    await TestBed.configureTestingModule({
      imports: [ObjectDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
          },
        },
        { provide: ObjectsService, useValue: objectsServiceMock },
        { provide: MapService, useValue: mapServiceMock },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getObjectById on init', () => {
    expect(component.id).toBe('123');
    expect(objectsServiceMock.getObjectById).toHaveBeenCalledWith('123');
    expect(component.objectData).toEqual(mockObject);
  });

  it('should call router navigate with ["/"] when onAnimateToView() called', () => {
    mapServiceMock.isShowMap = false;
    component.onAnimateToView();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    expect(mapServiceMock.toggleShowMap).toHaveBeenCalled();
    expect(mapServiceMock.onAnimateToView).toHaveBeenCalledWith(mockObject);
  });

  it('should call router navigate with ["/"] when onClose called', () => {
    component.onClose();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});

export const mockObject: ObjectData = {
  _id: '123',
  name: 'name',
  description: 'description',
  category: ObjectCategory.APARTMENT,
  location: {
    coordinateLonLat: [0, 0],
    country: 'country',
    place: 'place',
  },
  username: 'username',
};
