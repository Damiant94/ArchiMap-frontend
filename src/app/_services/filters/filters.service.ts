import { Injectable } from '@angular/core';
import { BehaviorSubject, debounce, tap, timer } from 'rxjs';
import { Filters } from '../../_models/filters';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  filters: Filters = {
    search: '',
    category: '',
    country: '',
  };

  private debounceTime = 500;

  filtersChangedSubject = new BehaviorSubject<Filters>(this.filters);

  filtersChanged$ = this.filtersChangedSubject.pipe(
    tap((filters) => {
      if (filters.search === this.filters.search) {
        this.debounceTime = 0;
      } else {
        this.debounceTime = 500;
      }
      this.filters = filters;
    }),
    debounce(() => timer(this.debounceTime))
  );
}
