import { Component } from '@angular/core';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectsService } from '../_services/objects/objects.service';
import { ObjectCategory, ObjectData } from '../_models/objectData';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MapService } from '../_services/map/map.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-object-details',
  standalone: true,
  imports: [
    BackdropComponent,
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './object-details.component.html',
  styleUrl: './object-details.component.scss',
})
export class ObjectDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private objectsService: ObjectsService,
    private mapService: MapService
  ) {}

  id: string = '';
  objectData: ObjectData | undefined;

  routeParamsSubscription: Subscription | undefined;
  getObjectSubscription: Subscription | undefined;

  ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

    this.getObjectSubscription = this.objectsService
      .getObjectById(this.id)
      .subscribe({
        next: (object) => {
          this.objectData = object;
        },
        error: () => {
          this.router.navigate(['/']);
        },
      });
  }

  getObjectCategoryIconUrl(category: ObjectCategory | undefined) {
    return this.mapService.getObjectCategoryIconUrl(category);
  }

  openGoogleMapsUrl(): void {
    const coordinateLonLat = this.objectData!.location.coordinateLonLat;
    // .../lat,lng
    const googleMapsUrl = `https://www.google.com/maps/place/${coordinateLonLat[1]},${coordinateLonLat[0]}`;
    window.open(googleMapsUrl, '_blank');
  }

  onAnimateToView(): void {
    this.router.navigate(['/']);
    if (!this.mapService.isShowMap) {
      this.mapService.toggleShowMap();
    }
    this.mapService.onAnimateToView(this.objectData!);
  }

  onClose(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.routeParamsSubscription!.unsubscribe();
    this.getObjectSubscription!.unsubscribe();
  }
}
