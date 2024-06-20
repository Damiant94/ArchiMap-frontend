import { Injectable } from '@angular/core';
import { ObjectCategory, ObjectData, ObjectDataMap } from '../../_models/objectData';
import { BehaviorSubject, Subject } from 'rxjs';

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
import { Icon, Style } from 'ol/style';

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

  openPopupSubject = new Subject<ObjectDataMap>();
  toggleShowMapSubject = new Subject<boolean>();
  isLoadingMapSubject = new BehaviorSubject<boolean>(true);

  isShowMap: boolean = true;
  popupData: ObjectData | undefined;

  private vectorSource: VectorSource | undefined;
  private vectorLayer: VectorLayer<Feature<Geometry>> | undefined;
  private overlay: Overlay | undefined;

  toggleShowMap() {
    this.isShowMap = !this.isShowMap;
    this.toggleShowMapSubject.next(this.isShowMap);
  }

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
    this.popupData = undefined;
    const coordinates = (feature.getGeometry() as Point).getCoordinates();
    const objectDataMap: ObjectDataMap = feature.get('ObjectDataMap');
    this.overlay!.setPosition(coordinates);
    this.openPopupSubject.next(objectDataMap);
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
        duration: 0,
        easing: easeOut,
      },
      (isAnimationFinished: boolean) => {
        if (isAnimationFinished) {
          view.animate(
            {
              center: coordinate,
              zoom: 15,
              duration: 3000,
              easing: easeOut,
            },
            (isAnimationFinished: boolean) => {
              if (isAnimationFinished) {
                const feature = this.getFeatureAtCoordinate(coordinate);
                this.setPopupContainer(feature);
              }
            }
          );
        }
      }
    );
  }

  getFeatureAtCoordinate(coordinate: Coordinate): Feature {
    return this.vectorSource!.getFeaturesAtCoordinate(coordinate)[0];
  }

  createMarkers(objects: ObjectDataMap[] | undefined): void {
    this.vectorSource?.refresh();

    objects?.forEach((object: ObjectDataMap): void => {
      this.createMarker(object);
    });

    this.isLoadingMapSubject.next(false);
  }

  createMarker(object: ObjectDataMap): void {
    const cordinate: Coordinate = fromLonLat(object.coordinateLonLat);

    const markerFeature = new Feature({
      geometry: new Point(cordinate),
      ObjectDataMap: { ...object },
    });

    const markerStyle = new Style({
      image: new Icon({
        src: this.getObjectCategoryIconUrl(object.category),
        anchor: [0.5, 1],
        scale: 1,
      }),
    });

    markerFeature.setStyle(markerStyle);
    this.vectorSource?.addFeature(markerFeature);
  }

  getObjectCategoryIconUrl(category: ObjectCategory | undefined): string {
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
      default:
        return 'mapIcons/other.png';
    }
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
