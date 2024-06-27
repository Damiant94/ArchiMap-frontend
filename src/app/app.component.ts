import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { MapComponent } from './map/map.component';
import { ObjectsListComponent } from './objects-list/objects-list.component';
import { FiltersComponent } from './filters/filters.component';
import { ObjectDetailsComponent } from './object-details/object-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    MapComponent,
    ObjectsListComponent,
    FiltersComponent,
    ObjectDetailsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
