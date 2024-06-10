import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { MapComponent } from './map/map.component';
import { ObjectsListComponent } from './objects-list/objects-list.component';
import { FiltersComponent } from './filters/filters.component';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private renderer: Renderer2) {}

  @ViewChild('objectsList') objectsList!: ElementRef<HTMLElement>;

  displayList = true;

  onToggle() {
    if (this.displayList) {
      this.displayList = false;
      this.renderer.setStyle(this.objectsList.nativeElement, 'zIndex', '0');
    } else {
      this.displayList = true;
      this.renderer.setStyle(this.objectsList.nativeElement, 'zIndex', '1');
    }
  }
}
