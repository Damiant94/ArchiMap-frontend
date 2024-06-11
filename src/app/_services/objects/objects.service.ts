import { Injectable } from '@angular/core';
import { ObjectData } from '../../_models/objectData';
import { BehaviorSubject, Subject } from 'rxjs';
import { Filters } from '../../_models/filters';
import { mockObjects } from './mockObjects';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  filtersSubject = new Subject<Filters>();
  objectsFilteredSubject = new BehaviorSubject<ObjectData[]>(mockObjects);

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

  getCountries() {
    const countries: string[] = []
    mockObjects.forEach(object => {
      const country = object.location.country;
      if (!countries.includes(country)) {
        countries.push(country)
      }
    })
    return [...countries];
  }

  getCategories() {
    const categories: string[] = []
    mockObjects.forEach(object => {
      const category = object.category;
      if (!categories.includes(category)) {
        categories.push(category)
      }
    })
    return [...categories];
  }
}
