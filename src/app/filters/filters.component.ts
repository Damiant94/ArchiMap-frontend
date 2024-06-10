import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ObjectsService } from '../_services/objects/objects.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {
  constructor(private objectsService: ObjectsService) {}

  searchInput: string = '';
  typeSelect: string = '';
  countrySelect: string = '';

  onFilterChange() {
    this.objectsService.filtersSubject.next({
      search: this.searchInput,
      type: this.typeSelect,
      country: this.countrySelect,
    });
  }
}
