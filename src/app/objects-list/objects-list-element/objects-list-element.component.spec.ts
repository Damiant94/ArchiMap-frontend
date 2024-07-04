import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectsListElementComponent } from './objects-list-element.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { MapService } from '../../_services/map/map.service';
import { ObjectCategory, ObjectData } from '../../_models/objectData';
import { Router } from '@angular/router';

describe('ObjectsListElementComponent', () => {
  let component: ObjectsListElementComponent;
  let fixture: ComponentFixture<ObjectsListElementComponent>;
  let mapServiceMock: MapService;
  let routerMock: Router;

  beforeEach(async () => {
    mapServiceMock = jasmine.createSpyObj<MapService>('ObjectsService', {
      onAnimateToView: undefined,
      toggleShowMap: undefined,
    });

    routerMock = jasmine.createSpyObj<Router>('Router', {
      navigate: undefined,
    });

    await TestBed.configureTestingModule({
      imports: [ObjectsListElementComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
        { provide: MapService, useValue: mapServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectsListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onAnimateToView should call mapService methods', () => {
    const event = {
      stopPropagation: () => undefined,
    };
    component.onAnimateToView(event);
    expect(mapServiceMock.onAnimateToView).toHaveBeenCalled();
    expect(mapServiceMock.toggleShowMap).toHaveBeenCalled();
  });

  it('openDetails should call router navigate to /details with mock object id', () => {
    component.objectData = mockObject;
    component.openDetails();
    expect(routerMock.navigate).toHaveBeenCalledWith(['details', mockObject._id]);
  });
});

const mockObject: ObjectData = {
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
