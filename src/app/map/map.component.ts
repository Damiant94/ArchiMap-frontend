import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import { MapService } from '../_services/map/map.service';

import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import { Geometry, Point } from 'ol/geom';
import Overlay from 'ol/Overlay';
import { ObjectsService } from '../_services/objects/objects.service';
import { ObjectCategory, ObjectData } from '../_models/objectData';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { fromLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  template: '',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit {
  private map: Map | undefined;
  // private overlay: Overlay | undefined;
  private vectorSource!: VectorSource;
  private vectorLayer!: VectorLayer<Feature<Geometry>>;

  constructor(
    private elementRef: ElementRef,
    private mapService: MapService,
    private objectsService: ObjectsService
  ) {}

  ngOnInit() {
    this.map = this.mapService.getMap();
    this.map.setTarget(this.elementRef.nativeElement);

    this.createNewVectorSource();
    this.createMarkers();

    this.map.on('pointermove', (event) => {
      const hit = this.map!.hasFeatureAtPixel(event.pixel);
      this.map!.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
  }

  createNewVectorSource(): void {
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });
    this.map?.addLayer(this.vectorLayer);
  }

  createMarkers(): void {
    this.objectsService.objectsFilteredSubject.subscribe(
      (objects: ObjectData[] | undefined) => {
        this.vectorSource.refresh();

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
      name: object.name,
      description: object.description,
    });

    const markerStyle = new Style({
      image: new Icon({
        src: this.getMapIconUrl(object.category),
        anchor: [0.5, 1],
        scale: 1
      })
    });

    markerFeature.setStyle(markerStyle);
    this.vectorSource.addFeature(markerFeature);
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
