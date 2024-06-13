import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ObjectsService } from '../_services/objects/objects.service';
import { FormsModule } from '@angular/forms';
import { ObjectCategory } from '../_models/objectData';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  constructor(private objectsService: ObjectsService) {}

  searchInput: string = '';
  typeSelect: string = '';
  countrySelect: string = '';

  countries: string[] = [];
  categories: string[] = Object.keys(ObjectCategory);

  onFilterChange() {
    this.objectsService.filtersSubject.next({
      search: this.searchInput,
      type: this.typeSelect,
      country: this.countrySelect,
    });
  }

  ngOnInit() {
    this.objectsService.objectsChangedSubject
      .pipe(switchMap(() => this.objectsService.getCountries()))
      .subscribe({
        next: (countries) => {
          this.countries = countries;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
