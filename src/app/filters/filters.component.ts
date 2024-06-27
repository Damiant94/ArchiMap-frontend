import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ObjectsService } from '../_services/objects/objects.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ObjectCategory } from '../_models/objectData';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Subscription, debounce, tap, timer } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MapService } from '../_services/map/map.service';
import { Filters } from '../_models/filters';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  constructor(
    private objectsService: ObjectsService,
    private mapService: MapService,
    private formBuilder: FormBuilder
  ) {}

  countries = this.objectsService.getCountries();
  categories: string[] = Object.keys(ObjectCategory).sort();

  filtersForm!: FormGroup;
  debounceTime = 500;

  searchValue: string | undefined;

  filtersFormChangedSubscription: Subscription | undefined;
  
  get filtersValue() {
    return this.filtersForm.value;
  }

  get isShowMap() {
    return this.mapService.isShowMap;
  }

  ngOnInit() {
    this.filtersForm = this.formBuilder.group({
      search: [''],
      category: [''],
      country: [''],
    });

    this.filtersFormChangedSubscription = this.filtersForm.valueChanges
      .pipe(
        tap((filters: Filters) => {
          if (filters.search === this.searchValue) {
            this.debounceTime = 0;
          } else {
            this.debounceTime = 500;
          }
          this.searchValue = filters.search;
        }),
        debounce(() => timer(this.debounceTime))
      )
      .subscribe({
        next: (value: Filters) => {
          this.objectsService.setFilters(value);
          this.objectsService.filtersChangedSubject.next(value);
        },
      });
  }

  isFiltersEmpty(): boolean {
    return (
      this.searchInput?.value === '' &&
      this.categorySelect?.value === '' &&
      this.countrySelect?.value === ''
    );
  }

  get searchInput() {
    return this.filtersForm.get('search');
  }
  get categorySelect() {
    return this.filtersForm.get('category');
  }
  get countrySelect() {
    return this.filtersForm.get('country');
  }

  onResetFilters(): void {
    if (this.isFiltersEmpty()) return;
    this.searchInput?.setValue('');
    this.categorySelect?.setValue('');
    this.countrySelect?.setValue('');
  }

  onToggleShowMap() {
    this.mapService.toggleShowMap();
  }

  ngOnDestroy() {
    this.filtersFormChangedSubscription!.unsubscribe();
  }
}
