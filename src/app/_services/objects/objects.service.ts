import { Injectable } from '@angular/core';
import { ObjectCategory, ObjectData } from '../../_models/objectData';
import {
  Observable,
  Subject,
  Subscription,
  debounce,
  map,
  tap,
  timer,
} from 'rxjs';
import { Filters } from '../../_models/filters';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  filtersChangedSubject = new Subject<Filters>();
  objectsChangedSubject = new Subject<ObjectData[]>();
  countriesCheckSubject = new Subject<void>();

  private filtersChangedSubscription: Subscription | undefined;

  filteredObjects: ObjectData[] | undefined;

  private filters: Filters = {
    search: '',
    category: '',
    country: '',
  };

  private debounceTime = 500;

  constructor(private http: HttpClient, private router: Router) {
    this.filtersChangedSubject
      .pipe(
        tap((filters) => {
          if (filters.search === this.filters.search) {
            this.debounceTime = 0;
          } else {
            this.debounceTime = 500;
          }
        }),
        debounce(() => timer(this.debounceTime))
      )
      .subscribe((filters: Filters) => {
        this.filters = filters;
        this.getObjects().subscribe();
        this.emitNewFilteredObjects();
      });
  }

  getObjects(query: any = {}): Observable<ObjectData[]> {
    let params: any = {};
    if (query.querySearch) {
      params.querySearch = query.querySearch;
    }
    if (query.category) {
      params.category = query.category;
    }
    if (query.country) {
      params.country = query.country;
    }
    return this.http
      .get<any>(`${environment.urlApi}/feed/get-objects`, { params: params })
      .pipe(map((results) => this.filterObjects(results)))
      .pipe(
        tap((filteredObjects) => {
          this.filteredObjects = filteredObjects;
          this.emitNewFilteredObjects();
        })
      );
  }

  emitNewFilteredObjects() {
    this.objectsChangedSubject.next(this.filteredObjects!);
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
          this.getObjects(this.filters).subscribe(() => {
            this.router.navigate(['/']);
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  filterObjects(objects: ObjectData[]): ObjectData[] {
    return objects.filter((object: ObjectData) => {
      return (
        (object.name
          .toLowerCase()
          .includes(this.filters.search.toLowerCase()) ||
          this.filters.search === '') &&
        (object.category.toLowerCase() ===
          this.filters.category.toLowerCase() ||
          this.filters.category === '') &&
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

  ngOnDestroy() {
    this.filtersChangedSubscription?.unsubscribe();
  }
}
