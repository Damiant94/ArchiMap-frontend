import { Injectable } from '@angular/core';
import { ObjectCategory, ObjectData } from '../../_models/objectData';
import { BehaviorSubject, Observable, Subject, Subscription, tap } from 'rxjs';
import { Filters } from '../../_models/filters';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  filtersSubject = new Subject<Filters>();
  objectsChangedSubject = new BehaviorSubject<ObjectData[]>([]);

  objects: ObjectData[] = [];
  filteredObjects: ObjectData[] = [];

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
  }

  emitNewFilteredObjects(): void {
    this.filterObjects();
    this.objectsChangedSubject.next(this.filteredObjects);
  }

  getObjects(): Observable<ObjectData[]> {
    return this.http.get<any>(`${environment.urlApi}/feed/get-objects`).pipe(
      tap((objects: ObjectData[]) => {
        this.objects = objects;
        this.emitNewFilteredObjects();
      })
    );
  }

  getObjectById(id: string): Observable<ObjectData> {
    return this.http.get<any>(`${environment.urlApi}/feed/get-object/${id}`);
  }

  getCountries(): Observable<string[]> {
    return this.http.get<any>(`${environment.urlApi}/feed/get-countries`);
  }

  addNewObject(objectData: ObjectData): Subscription {
    return this.http
      .post<any>(`${environment.urlApi}/feed/add-object/`, objectData)
      .subscribe({
        next: () => {
          this.getObjects().subscribe(() => {
            this.router.navigate(['/']);
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  filterObjects(): void {
    this.filteredObjects = this.objects.filter((object: ObjectData) => {
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
