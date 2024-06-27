import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core';

import { ObjectDataMap } from '../_models/objectData';
import { ObjectsService } from '../_services/objects/objects.service';
import { MapService } from '../_services/map/map.service';
import { MapPopupComponent } from './map-popup/map-popup.component';

import Map from 'ol/Map';
import { Subscription, switchMap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapPopupComponent, MatProgressSpinnerModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  @ViewChild('popupContainer') popupContainer: ElementRef | undefined;

  private map: Map | undefined;

  private toggleShowMapSubscription: Subscription | undefined;
  private getObjectsForMapSubscription: Subscription | undefined;
  private filtersChangedSubscription: Subscription | undefined;

  constructor(
    private elementRef: ElementRef,
    private mapService: MapService,
    private objectsService: ObjectsService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.toggleShowMapSubscription =
      this.mapService.toggleShowMapSubject.subscribe((isShowMap) => {
        if (isShowMap) {
          this.showMap();
        } else {
          this.hideMap();
        }
      });
  }

  ngAfterViewInit() {
    this.map = this.mapService.getMap();
    this.map.setTarget(this.elementRef.nativeElement);

    this.mapService.createNewVectorSource();
    this.mapService.createOverlayForPopups(this.popupContainer?.nativeElement);

    this.getObjectsForMapSubscription = this.objectsService
      .getObjectsForMap()
      .subscribe({
        next: (objects: ObjectDataMap[]) => {
          this.mapService.createMarkers(objects);
        },
      });

    this.filtersChangedSubscription = this.objectsService.filtersChangedSubject
      .pipe(
        switchMap(() => {
          return this.objectsService.getObjectsForMap();
        })
      )
      .subscribe({
        next: (objects: ObjectDataMap[]) => {
          this.mapService.createMarkers(objects);
        },
      });

    this.map.on('pointermove', (pointerMoveEvent) => {
      const hit = this.map!.hasFeatureAtPixel(pointerMoveEvent.pixel);
      this.map!.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    this.map.on('singleclick', (clickEvent) => {
      const feature = this.map!.forEachFeatureAtPixel(
        clickEvent.pixel,
        (feature) => feature
      );

      if (feature) {
        this.mapService.setPopupContainer(feature);
      } else {
        this.mapService.removePopupContainer();
      }
    });
  }

  showMap() {
    document.parentElement;
    this.renderer.setStyle(
      this.elementRef.nativeElement.parentNode,
      'zIndex',
      '1'
    );
  }

  hideMap() {
    this.renderer.setStyle(
      this.elementRef.nativeElement.parentNode,
      'zIndex',
      '0'
    );
  }

  ngOnDestroy() {
    this.toggleShowMapSubscription?.unsubscribe();
    this.getObjectsForMapSubscription?.unsubscribe();
    this.filtersChangedSubscription?.unsubscribe();
  }
}
