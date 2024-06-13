import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { ObjectData } from '../_models/objectData';
import { ObjectsService } from '../_services/objects/objects.service';
import { MapService } from '../_services/map/map.service';
import { MapPopupComponent } from './map-popup/map-popup.component';

import Map from 'ol/Map';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MapPopupComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  objectData: ObjectData | undefined;
  @ViewChild('popupContainer') popupContainer: ElementRef | undefined;

  private map: Map | undefined;

  constructor(
    private elementRef: ElementRef,
    private mapService: MapService,
    private objectsService: ObjectsService
  ) {}

  ngAfterViewInit() {
    this.map = this.mapService.getMap();
    this.map.setTarget(this.elementRef.nativeElement);

    this.mapService.openPopupSubject.subscribe((objectData: ObjectData) => {
      this.objectData = objectData;
    });

    this.mapService.createNewVectorSource();
    this.objectsService.objectsChangedSubject.subscribe(
      (objects: ObjectData[] | undefined) => {
        this.mapService.createMarkers(objects);
      }
    );
    this.mapService.createOverlayForPopups(this.popupContainer?.nativeElement);

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
}
