import { Injectable } from '@angular/core';
import { ObjectCategory, ObjectData } from '../../_models/objectData';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Filters } from '../../_models/filters';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  filtersSubject = new Subject<Filters>();
  objectsChangedSubject = new BehaviorSubject<ObjectData[]>([]);
  objects: ObjectData[] = [];

  private filters: Filters = {
    search: '',
    type: '',
    country: '',
  };

  constructor(private http: HttpClient, private router: Router) {
    this.filtersSubject.subscribe((filters: Filters) => {
      this.filters = filters;
      this.emitNewFilteredObjects();
    });
    this.getObjects().subscribe((objects) => {
      this.objects = objects;
      this.emitNewFilteredObjects();
    });
  }

  emitNewFilteredObjects() {
    const filteredObjects = this.getFilteredObjects();
    this.objectsChangedSubject.next(filteredObjects);
  }

  getObjects(): Observable<ObjectData[]> {
    return this.http.get<any>(`http://localhost:8080/feed/get-objects`);
  }

  getObjectById(id: string): Observable<ObjectData> {
    return this.http.get<any>(`http://localhost:8080/feed/get-object/${id}`);
  }

  getCountries(): Observable<string[]> {
    return this.http.get<any>(`http://localhost:8080/feed/get-countries`);
  }

  addNewObject(objectData: ObjectData) {
    return this.http
      .post<any>(`http://localhost:8080/feed/add-object/`, objectData)
      .subscribe({
        next: (result) => {
          this.getObjects().subscribe({
            next: (objects) => {
              this.objects = objects;
              this.emitNewFilteredObjects();
              this.router.navigate(["/"])
            },
            error: (err: any) => {
              console.log(err)
            }
          })
        },
        error: (err) => {
          console.log;
        },
      })
  }

  getFilteredObjects(): ObjectData[] {
    return this.objects.filter((object: ObjectData) => {
      return (
        (object.name
          .toLowerCase()
          .includes(this.filters.search.toLowerCase()) ||
          this.filters.search === '') &&
        (object.category.toLowerCase() === this.filters.type.toLowerCase() ||
          this.filters.type === '') &&
        (object.location.country.toLowerCase() ===
          this.filters.country.toLowerCase() ||
          this.filters.country === '')
      );
    });
  }

  getObjectCategoryIconUrl(category: ObjectCategory | undefined): string {
    switch (category) {
      case ObjectCategory.APARTMENT:
        return 'mapIcons/apartment.png';
      case ObjectCategory.NATURE:
        return 'mapIcons/nature.png';
      case ObjectCategory.CATHEDRAL:
        return 'mapIcons/cathedral.png';
      case ObjectCategory.MONUMENT:
        return 'mapIcons/monument.png';
      case ObjectCategory.COMPANY:
        return 'mapIcons/company.png';
      case ObjectCategory.OTHER:
        return 'mapIcons/other.png';
      default:
        return 'mapIcons/other.png';
    }
  }
}
