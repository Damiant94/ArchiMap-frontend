import { Injectable, inject } from '@angular/core';
import { ObjectData, ObjectDataMap } from '../../_models/objectData';
import {
  Observable,
  Subject,
  Subscription,
  catchError,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../../_models/notifications';
import { MapService } from '../map/map.service';
import { FiltersService } from '../filters/filters.service';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  objectsChangedSubject = new Subject<ObjectData[]>();
  objectsForMapChangedSubject = new Subject<ObjectDataMap[]>();
  countriesCheckSubject = new Subject<void>();

  isLoadingList: boolean = false;

  page: number = 1;
  scrollFetchingBlocked = false;
  objects: ObjectData[] | undefined;
  objectsForMap: ObjectDataMap[] | undefined;

  mapService = inject(MapService);

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationsService: NotificationsService,
    private filtersService: FiltersService
  ) {
    this.filtersService.filtersChanged$.subscribe(() => {
      this.resetPage();
      this.scrollFetchingBlocked = false;
      this.getObjects().subscribe();
      this.getObjectsForMap().subscribe();
    });
  }

  setNextPage() {
    this.page++;
  }

  resetPage() {
    this.page = 1;
  }

  getObjects(): Observable<ObjectData[]> {
    this.isLoadingList = true;
    let params = this.getQueryParams();
    params.page = this.page;
    return this.http
      .get<any>(`${environment.urlApi}/feed/get-objects`, { params: params })
      .pipe(
        tap((objects) => {
          if (this.page === 1) {
            this.scrollFetchingBlocked = false;
            this.objects = objects;
            this.emitNewObjects();
          } else {
            if (objects.length === 0) {
              this.scrollFetchingBlocked = true;
              this.isLoadingList = false;
            } else {
              this.scrollFetchingBlocked = false;
              this.objects = this.objects?.concat(objects);
              this.emitNewObjects();
            }
          }
        })
      );
  }

  getObjectsForMap(): Observable<ObjectDataMap[]> {
    this.mapService.isLoadingMapSubject.next(true);
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
    const query = this.filtersService.filters;
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
    this.router.navigate(['/']);
    return this.http
      .post<any>(`${environment.urlApi}/feed/add-object/`, objectData)
      .subscribe(() => {
        this.notificationsService.pushNotification(
          'Thanks for sharing the object. Object is being modereted and will be added soon.',
          NotificationType.INFO,
          10000
        );
      });
  }
}
