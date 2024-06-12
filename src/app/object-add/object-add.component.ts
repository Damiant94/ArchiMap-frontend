import { Component, ElementRef, ViewChild } from '@angular/core';
import { BackdropComponent } from '../backdrop/backdrop.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ObjectCategory, ObjectData } from '../_models/objectData';
import { MapService } from '../_services/map/map.service';

import Map from 'ol/Map';
import { Coordinate } from 'ol/coordinate';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Geometry, Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { Icon, Style } from 'ol/style';
import { GeoDataService } from '../_services/geo-data/geo-data.service';
import { ObjectsService } from '../_services/objects/objects.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-object-add',
  standalone: true,
  imports: [BackdropComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './object-add.component.html',
  styleUrl: './object-add.component.scss',
})
export class ObjectAddComponent {
  @ViewChild('mapContainer') mapContainer: ElementRef | undefined;
  stage: 1 | 2 = 1;
  addObjectForm1stage!: FormGroup;
  addObjectForm2stage!: FormGroup;

  country: string | undefined;
  city: string | undefined;
  coordinateLonLat: Coordinate | undefined;
  private googleMapsUrl: string | undefined;
  private username: string | undefined;
  private userId: string | undefined;

  private map: Map | undefined;
  private vectorSource: VectorSource | undefined;
  private vectorLayer: VectorLayer<Feature<Geometry>> | undefined;

  categories: string[] = Object.keys(ObjectCategory);

  constructor(
    private formBuilder: FormBuilder,
    private mapService: MapService,
    private geoDataService: GeoDataService,
    private objectsService: ObjectsService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.createForm1stage();
  }

  ngAfterViewChecked() {
    this.map?.setTarget(this.mapContainer?.nativeElement);
  }

  createForm1stage(): void {
    this.map = this.mapService.getNewMap();
    this.map.setTarget(this.mapContainer?.nativeElement);
    this.map.getView().setMaxZoom(18);

    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });
    this.map?.addLayer(this.vectorLayer);

    this.map.on('singleclick', (clickEvent) => {
      this.coordinateLonLat = toLonLat(clickEvent.coordinate);

      this.createMarker(clickEvent.coordinate);

      this.geoDataService
        .getGeoData([this.coordinateLonLat[1], this.coordinateLonLat[0]])
        .subscribe(({ countryName, city }) => {
          this.country = countryName;
          this.city = city;
        });
    });
  }

  createMarker(coordinate: Coordinate) {
    this.vectorSource?.refresh();
    const markerFeature = new Feature({
      geometry: new Point(coordinate),
    });

    const markerStyle = new Style({
      image: new Icon({
        src: 'mapIcons/new-point.png',
        anchor: [0.5, 1],
        scale: 0.6,
      }),
    });

    markerFeature.setStyle(markerStyle);
    this.vectorSource?.addFeature(markerFeature);
  }

  createForm2stage(): void {
    this.addObjectForm2stage = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(1000),
        ],
      ],
      category: [ObjectCategory.OTHER, [Validators.required]],
      location: this.formBuilder.group({
        country: [
          {
            value: this.country,
            disabled: true,
          },
          [Validators.required],
        ],
        city: [
          {
            value: this.city,
            disabled: true,
          },
          [Validators.required],
        ],
      }),
      imageUrl: [undefined],
    });
  }

  onNext(): void {
    this.createForm2stage();
    this.stage = 2;
    this.googleMapsUrl = this.getGoogleMapsUrl(this.coordinateLonLat!);
    console.log(this.googleMapsUrl);
  }

  onBack(): void {
    this.stage = 1;
  }

  onSubmit(): void {
    const formRawValue = this.addObjectForm2stage.getRawValue();
    const newObject: ObjectData = {
      ...formRawValue,
      username: 'newuser',
      location: {
        ...formRawValue.location,
        coordinateLonLat: this.coordinateLonLat,
      },
    };
    this.objectsService.addNewObject(newObject);
  }

  getGoogleMapsUrl(coordinateLonLat: Coordinate): string {
    // .../lat,lng
    return `https://www.google.com/maps/place/${coordinateLonLat[1]},${coordinateLonLat[0]}`;
  }
}
