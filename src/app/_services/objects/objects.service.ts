import { Injectable } from '@angular/core';
import { ObjectData, ObjectDataMap } from '../../_models/objectData';
import {
  Observable,
  Subject,
  Subscription,
  catchError,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Filters } from '../../_models/filters';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  page: number = 1;

  filtersChangedSubject = new Subject<Filters>();
  filters: Filters = { search: '', category: '', country: '' };

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationsService: ToastrService
  ) {}

  setFilters(filters: Filters) {
    this.filters = filters;
  }

  setNextPage() {
    this.page++;
  }

  resetPage() {
    this.page = 1;
  }

  getObjects(): Observable<ObjectData[]> {
    let params = this.getQueryParams();
    params.page = this.page;
    return this.http.get<any>(`${environment.urlApi}/feed/get-objects`, {
      params: params,
    });
  }

  getObjectsForMap(): Observable<ObjectDataMap[]> {
    const params = this.getQueryParams();
    return this.http.get<any>(
      `${environment.urlApi}/feed/get-objects-for-map`,
      {
        params: params,
      }
    );
  }

  getQueryParams() {
    let params: any = {};
    if (this.filters.search) {
      params.querySearch = this.filters.search;
    }
    if (this.filters.category) {
      params.category = this.filters.category;
    }
    if (this.filters.country) {
      params.country = this.filters.country;
    }
    return params;
  }

  getObjectById(id: string): Observable<ObjectData> {
    return this.http
      .get<any>(`${environment.urlApi}/feed/get-object/${id}`)
      .pipe(
        catchError((error) => {
          this.notificationsService.error("Couldn't find object", 'error');
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
        this.notificationsService.success(
          'Thanks for sharing the object. Object is being modereted and will be added soon.',
          'success'
        );
      });
  }
}
