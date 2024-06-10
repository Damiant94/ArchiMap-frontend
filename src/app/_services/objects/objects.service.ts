import { Injectable } from '@angular/core';
import { ObjectCategory, ObjectData } from '../../_models/objectData';
import { Subject } from 'rxjs';
import { Filters } from '../../_models/filters';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  filtersSubject = new Subject<Filters>();
  objectsFilteredSubject = new Subject<ObjectData[]>();

  private filters: Filters = {
    search: '',
    type: '',
    country: '',
  };

  constructor() {
    this.filtersSubject.subscribe((filters: Filters) => {
      this.filters = filters;
      this.objectsFilteredSubject.next(this.getFilteredObjects());
    });
  }

  getFilteredObjects() {
    return [...mockObjects].filter((object: ObjectData) => {
      return (
        (object.name.toLowerCase().includes(this.filters.search.toLowerCase()) || this.filters.search === '') &&
        (object.category.toLowerCase() === this.filters.type.toLowerCase() || this.filters.type === '') &&
        (object.location.country.toLowerCase() === this.filters.country.toLowerCase() || this.filters.country === '')
      );
    });
  }
}

export const mockObjects: ObjectData[] = [
  {
    id: '1',
    name: 'Eiffel Tower',
    description: 'Desc',
    location: {
      coordinates: [11, 22],
      country: 'France',
      city: 'Paris',
    },
    category: ObjectCategory.MONUMENT,
    userData: {
      userId: '2',
      userName: 'SuperAwesomeUser',
    },
  },
  {
    id: '2',
    name: 'Palac Kultury I Nauki',
    description: 'Opis super budynek',
    location: {
      coordinates: [10, 22],
      country: 'Poland',
      city: 'Warsaw',
    },
    category: ObjectCategory.MONUMENT,
    userData: {
      userId: '2',
      userName: 'SuperAwesomeUser',
    },
  },
  {
    id: '3',
    name: 'Krzywa Wieza',
    description: 'Desc',
    location: {
      coordinates: [21, 3],
      country: 'Italy',
      city: 'Piza',
    },
    category: ObjectCategory.MONUMENT,
    userData: {
      userId: '2',
      userName: 'SuperAwesomeUser',
    },
  },
  {
    id: '4',
    name: 'Luk Tryumfalny',
    description: 'Desc',
    location: {
      coordinates: [11, 2],
      country: 'France',
      city: 'Paris',
    },
    category: ObjectCategory.MONUMENT,
    userData: {
      userId: '2',
      userName: 'SuperAwesomeUser',
    },
  },
  {
    id: '5',
    name: 'Sky Tower',
    description: 'Desc',
    location: {
      coordinates: [14, 2],
      country: 'Poland',
      city: 'Wroclaw',
    },
    category: ObjectCategory.COMPANY,
    userData: {
      userId: '2',
      userName: 'SuperAwesomeUser',
    },
  },
  {
    id: '6',
    name: 'Eiffel Tower',
    description: 'Desc',
    location: {
      coordinates: [18, 4],
      country: 'France',
      city: 'Paris',
    },
    category: ObjectCategory.MONUMENT,
    userData: {
      userId: '2',
      userName: 'SuperAwesomeUser',
    },
  },
  {
    id: '7',
    name: 'Blok',
    description: 'Desc',
    location: {
      coordinates: [10, 3],
      country: 'Poland',
      city: 'Zgierz',
    },
    category: ObjectCategory.APARTMENT,
    userData: {
      userId: '2',
      userName: 'SuperAwesomeUser',
    },
  },
  {
    id: '8',
    name: 'Colosseum',
    description: 'Desc',
    location: {
      coordinates: [3, 3],
      country: 'Italy',
      city: 'Rome',
    },
    category: ObjectCategory.MONUMENT,
    userData: {
      userId: '2',
      userName: 'SuperAwesomeUser',
    },
  },
];
