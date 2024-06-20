import { Injectable } from '@angular/core';
import {
  ObjectCategory,
  ObjectData,
  ObjectDataMap,
} from '../../_models/objectData';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  catchError,
  debounce,
  tap,
  throwError,
  timer,
} from 'rxjs';
import { Filters } from '../../_models/filters';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../../_models/notifications';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  filtersChangedSubject = new Subject<Filters>();
  objectsChangedSubject = new Subject<ObjectData[]>();
  objectsForMapChangedSubject = new Subject<ObjectDataMap[]>();
  countriesCheckSubject = new Subject<void>();
  isLoadingMapSubject = new BehaviorSubject<boolean>(true);
  isLoadingListSubject = new BehaviorSubject<boolean>(true);

  private filtersChangedSubscription: Subscription | undefined;

  page: number = 1;
  scrollFetchingBlocked = false;
  objects: ObjectData[] | undefined;
  objectsForMap: ObjectDataMap[] | undefined;

  filters: Filters = {
    search: '',
    category: '',
    country: '',
  };

  private debounceTime = 500;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationsService: NotificationsService
  ) {
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
        this.page = 1;
        this.scrollFetchingBlocked = false;
        this.getObjects().subscribe();
        this.getObjectsForMap().subscribe();
      });
  }

  setNextPage() {
    this.page++;
  }

  getObjects(): Observable<ObjectData[]> {
    this.isLoadingListSubject.next(true);
    let params = this.getQueryParams();
    params.page = this.page;
    return this.http
      .get<any>(`${environment.urlApi}/feed/get-objects`, { params: params })
      .pipe(
        tap((objects) => {
          if (this.page === 1) {
            this.objects = objects;
            this.emitNewObjects();
          } else {
            if (objects.length === 0) {
              this.scrollFetchingBlocked = true;
              this.isLoadingListSubject.next(false);
            } else {
              this.objects = this.objects?.concat(objects);
              this.emitNewObjects();
            }
          }
        })
      );
  }

  getObjectsForMap(): Observable<ObjectDataMap[]> {
    this.isLoadingMapSubject.next(true);
    const params = this.getQueryParams();
    return this.http
      .get<any>(`${environment.urlApi}/feed/get-objects-for-map`, {
        params: params,
      })
      .pipe(
        tap((objects) => {
          this.objectsForMap = objects;
          this.emitNewObjectsForMap();
        })
      );
  }

  getQueryParams() {
    const query = this.filters;
    let params: any = {};
    if (query.search) {
      params.querySearch = query.search;
    }
    if (query.category) {
      params.category = query.category;
    }
    if (query.country) {
      params.country = query.country;
    }
    return params;
  }

  emitNewObjects() {
    this.objectsChangedSubject.next(this.objects!);
  }

  emitNewObjectsForMap() {
    this.objectsForMapChangedSubject.next(this.objectsForMap!);
  }

  getObjectById(id: string): Observable<ObjectData> {
    return this.http
      .get<any>(`${environment.urlApi}/feed/get-object/${id}`)
      .pipe(
        catchError((error) => {
          this.notificationsService.pushNotification(
            "Coudn't find object",
            NotificationType.WARN
          );
          return throwError(() => new Error(error));
        })
      );
  }

  getCountries(): Observable<string[]> {
    return this.http.get<any>(`${environment.urlApi}/feed/get-countries`);
  }

  addNewObject(objectData: ObjectData): Subscription {
    return this.http
      .post<any>(`${environment.urlApi}/feed/add-object/`, objectData)
      .subscribe(() => {
        this.getObjects().subscribe(() => {
          this.router.navigate(['/']);
        });
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
