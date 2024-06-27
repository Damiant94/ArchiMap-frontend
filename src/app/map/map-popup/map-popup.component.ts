import { Component } from '@angular/core';
import { ObjectsListElementComponent } from '../../objects-list/objects-list-element/objects-list-element.component';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MapService } from '../../_services/map/map.service';

@Component({
  selector: 'app-map-popup',
  standalone: true,
  imports: [
    ObjectsListElementComponent,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './map-popup.component.html',
  styleUrl: './map-popup.component.scss',
})
export class MapPopupComponent {
  constructor(private router: Router, private mapService: MapService) {}

  openDetails(): void {
    this.router.navigate(['details', this.objectData?._id]);
  }

  get objectData() {
    return this.mapService.popupData;
  }
}
