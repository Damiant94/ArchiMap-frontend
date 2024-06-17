import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ObjectsService } from '../_services/objects/objects.service';
import { FormsModule } from '@angular/forms';
import { ObjectCategory } from '../_models/objectData';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Subscription, switchMap } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MapService } from '../_services/map/map.service';

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
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  constructor(
    private objectsService: ObjectsService,
    private mapService: MapService
  ) {}

  searchInput: string = '';
  categorySelect: string = '';
  countrySelect: string = '';

  isShowList: boolean = false;

  countries: string[] = [];
  categories: string[] = Object.keys(ObjectCategory);

  private objectsChangedSubscription: Subscription | undefined;
  private countriesCheckSubscription: Subscription | undefined;

  onFilterChange() {
    this.objectsService.filtersChangedSubject.next(this.filtersValue)
  }

  get filtersValue() {
    return {
      search: this.searchInput,
      category: this.categorySelect,
      country: this.countrySelect,
    };
  }

  ngOnInit() {
    this.countriesCheckSubscription = this.objectsService.countriesCheckSubject
      .pipe(switchMap(() => this.objectsService.getCountries()))
      .subscribe({
        next: (countries) => {
          this.countries = countries;
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.objectsService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isFiltersEmpty(): boolean {
    return !this.searchInput && !this.categorySelect && !this.countrySelect;
  }

  onResetFilters(): void {
    if (this.isFiltersEmpty()) return;
    this.searchInput = '';
    this.categorySelect = '';
    this.countrySelect = '';
    this.onFilterChange();
  }

  onToggleShowMap() {
    this.mapService.toggleShowMap();
  }

  ngOnDestroy() {
    this.objectsChangedSubscription?.unsubscribe();
    this.countriesCheckSubscription?.unsubscribe();
  }
}
