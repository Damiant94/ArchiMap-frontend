import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectsListComponent } from './objects-list.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { ObjectsService } from '../_services/objects/objects.service';
import { Subject, of } from 'rxjs';
import { ObjectCategory, ObjectData } from '../_models/objectData';
import { Filters } from '../_models/filters';

describe('ObjectsListComponent', () => {
  let component: ObjectsListComponent;
  let fixture: ComponentFixture<ObjectsListComponent>;
  let objectsServiceMock: ObjectsService;

  const setGetObjectsReturnNewValue = (newValue: ObjectData[]) => {
    objectsServiceMock.getObjects = jasmine
      .createSpy()
      .and.returnValue(of(newValue));
  };

  beforeEach(async () => {
    objectsServiceMock = jasmine.createSpyObj<ObjectsService>(
      'ObjectsService',
      {
        getObjects: of(mockObjects1),
        setNextPage: undefined,
        resetPage: undefined,
      }
    );
    const filtersChangedSubject = new Subject<Filters>();
    objectsServiceMock.filtersChangedSubject = filtersChangedSubject;

    await TestBed.configureTestingModule({
      imports: [ObjectsListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
        { provide: ObjectsService, useValue: objectsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set new objects on init', () => {
    expect(component.objects).toEqual(mockObjects1);
  });

  it('should set new objects after filters changed', () => {
    setGetObjectsReturnNewValue(mockObjects2);
    objectsServiceMock.filtersChangedSubject.next({
      search: '',
      category: '',
      country: '',
    });
    expect(component.objects).toEqual(mockObjects2);
  });

  it('should set proper objects after scroll', () => {
    expect(component.isScrollFetchingBlocked).toBeFalse();
    const event = {
      target: { scrollTop: 100, scrollHeight: 0, offsetHeight: 0 },
    };
    setGetObjectsReturnNewValue(mockObjects2);
    component.onScrollBottom(event);
    expect(component.objects).toEqual(mockObjects1.concat(mockObjects2));
    expect(component.isScrollFetchingBlocked).toBeFalse();
    setGetObjectsReturnNewValue(mockObjects3);
    component.onScrollBottom(event);
    expect(component.objects).toEqual(mockObjects1.concat(mockObjects2));
    expect(component.isScrollFetchingBlocked).toBeTrue();
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

const mockObjects1: ObjectData[] = [mockObject, mockObject, mockObject];
const mockObjects2: ObjectData[] = [mockObject];
const mockObjects3: ObjectData[] = [];
