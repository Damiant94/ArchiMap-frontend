import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { ObjectCategory, ObjectData } from '../_models/objectData';
import { MapPopupComponent } from './map-popup/map-popup.component';
import { ObjectsService } from '../_services/objects/objects.service';
import { MapService } from '../_services/map/map.service';

import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import { Geometry, Point } from 'ol/geom';
import Overlay from 'ol/Overlay';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';

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
  private vectorSource: VectorSource | undefined;
  private vectorLayer: VectorLayer<Feature<Geometry>> | undefined;
  private overlay: Overlay | undefined;

  constructor(
    private elementRef: ElementRef,
    private mapService: MapService,
    private objectsService: ObjectsService
  ) {}

  ngAfterViewInit() {
    this.map = this.mapService.getMap();
    this.map.setTarget(this.elementRef.nativeElement);

    this.createNewVectorSource();
    this.createMarkers();
    this.createOverlayForPopups()

    this.map.on('pointermove', (pointerMoveEvent) => {
      const hit = this.map!.hasFeatureAtPixel(pointerMoveEvent.pixel);
      this.map!.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    this.map?.on('singleclick', (clickEvent) => {
      const feature = this.map!.forEachFeatureAtPixel(
        clickEvent.pixel,
        (feature) => feature
      );

      if (feature) {
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        const objectData: ObjectData = feature.get('objectData');
        this.objectData = objectData;
        this.overlay!.setPosition(coordinates);
      } else {
        this.overlay!.setPosition(undefined);
      }
    });
  }

  createNewVectorSource(): void {
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });
    this.map?.addLayer(this.vectorLayer);
  }

  createOverlayForPopups(): void {
    this.overlay = new Overlay({
      element: this.popupContainer?.nativeElement,
      autoPan: true,
    });
    this.map?.addOverlay(this.overlay);
  }

  createMarkers(): void {
    this.objectsService.objectsFilteredSubject.subscribe(
      (objects: ObjectData[] | undefined) => {
        this.vectorSource?.refresh();

        objects?.forEach((object: ObjectData) => {
          this.createMarker(object);
        });
      }
    );
  }

  createMarker(object: ObjectData): void {
    const cordinate: Coordinate = fromLonLat(object.location.coordinates);

    const markerFeature = new Feature({
      geometry: new Point(cordinate),
      objectData: {...object}
    });

    const markerStyle = new Style({
      image: new Icon({
        src: this.getMapIconUrl(object.category),
        anchor: [0.5, 1],
        scale: 1,
      }),
    });

    markerFeature.setStyle(markerStyle);
    this.vectorSource?.addFeature(markerFeature);
  }

  getMapIconUrl(category: ObjectCategory): string {
    switch (category) {
      case ObjectCategory.APARTMENT:
        return 'mapIcons/apartment.png';
      case ObjectCategory.NATURE:
        return 'mapIcons/nature.png';
      case ObjectCategory.CATHEDRAL:
        return 'mapIcons/cathedral.png';
      case ObjectCategory.MONUMENT:
        return 'mapIcons/monument.png';
      case ObjectCategory.COMPANY:
        return 'mapIcons/company.png';
      case ObjectCategory.OTHER:
        return 'mapIcons/other.png';
    }
  }
}
