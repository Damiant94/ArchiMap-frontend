import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { MapComponent } from './map/map.component';
import { ObjectsListComponent } from './objects-list/objects-list.component';
import { FiltersComponent } from './filters/filters.component';
import { MatIconModule } from '@angular/material/icon';
import { ObjectDetailsComponent } from './object-details/object-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ObjectsService } from './_services/objects/objects.service';
import { Subscription } from 'rxjs';

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
    ObjectDetailsComponent,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

  constructor(
    private objectsService: ObjectsService,
  ) {
  }

  private getObjectsSubscription: Subscription | undefined;
  private getObjectsForMapSubscription: Subscription | undefined;

  ngOnInit() {
    this.getObjectsSubscription = this.objectsService.getObjects().subscribe();
    this.getObjectsForMapSubscription = this.objectsService.getObjectsForMap().subscribe();
  }

  ngOnDestroy() {
    this.getObjectsSubscription?.unsubscribe();
    this.getObjectsForMapSubscription?.unsubscribe();
  }
}
