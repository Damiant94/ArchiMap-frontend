import { Injectable } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';
import { easeOut } from 'ol/easing';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Geometry, Point } from 'ol/geom';
import Feature, { FeatureLike } from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { ObjectData } from '../../_models/objectData';
import { Icon, Style } from 'ol/style';
import { ObjectsService } from '../objects/objects.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map = new Map({
    view: new View({
      center: [0, 0],
      zoom: 1,
    }),
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
  });

  openPopupSubject = new Subject<ObjectData>();

  private vectorSource: VectorSource | undefined;
  private vectorLayer: VectorLayer<Feature<Geometry>> | undefined;
  private overlay: Overlay | undefined;

  constructor(private objectsService: ObjectsService) {}

  createNewVectorSource(): void {
    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });
    this.map?.addLayer(this.vectorLayer);
  }

  createOverlayForPopups(element: HTMLElement): void {
    this.overlay = new Overlay({
      element: element,
      autoPan: true,
    });
    this.map?.addOverlay(this.overlay);
  }

  setPopupContainer(feature: FeatureLike): void {
    const coordinates = (feature.getGeometry() as Point).getCoordinates();
    const objectData: ObjectData = feature.get('objectData');
    this.overlay!.setPosition(coordinates);
    this.openPopupSubject.next(objectData);
  }

  removePopupContainer(): void {
    this.overlay!.setPosition(undefined);
  }

  onAnimateToView(objectData: ObjectData): void {
    const view = this.map.getView();
    view.cancelAnimations();
    this.removePopupContainer();
    const coordinate = fromLonLat(objectData.location.coordinateLonLat);
    view.animate(
      {
        center: coordinate,
        zoom: 3,
        duration: 4000,
        easing: easeOut,
      },
      (isAnimationFinished: boolean) => {
        if (isAnimationFinished) {
          view.animate(
            {
              center: coordinate,
              zoom: 15,
              duration: 4000,
              easing: easeOut,
            },
            (isAnimationFinished: boolean) => {
              if (isAnimationFinished) {
                const feature =
                  this.vectorSource!.getFeaturesAtCoordinate(coordinate)[0];
                this.setPopupContainer(feature);
              }
            }
          );
        }
      }
    );
  }

  createMarkers(objects: ObjectData[] | undefined): void {
    this.vectorSource?.refresh();

    objects?.forEach((object: ObjectData): void => {
      this.createMarker(object);
    });
  }

  createMarker(object: ObjectData): void {
    const cordinate: Coordinate = fromLonLat(object.location.coordinateLonLat);

    const markerFeature = new Feature({
      geometry: new Point(cordinate),
      objectData: { ...object },
    });

    const markerStyle = new Style({
      image: new Icon({
        src: this.objectsService.getObjectCategoryIconUrl(object.category),
        anchor: [0.5, 1],
        scale: 1,
      }),
    });

    markerFeature.setStyle(markerStyle);
    this.vectorSource?.addFeature(markerFeature);
  }

  getMap(): Map {
    return this.map;
  }

  getNewMap(): Map {
    return new Map({
      view: new View({
        center: [0, 0],
        zoom: 1,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
    });
  }
}
