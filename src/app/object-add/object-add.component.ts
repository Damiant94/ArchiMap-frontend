import { Component, ElementRef, ViewChild } from '@angular/core';
import { BackdropComponent } from '../backdrop/backdrop.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Subscription, debounceTime } from 'rxjs';

import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import {
  ObjectCategory,
  ObjectData,
  ObjectStatus,
} from '../_models/objectData';
import { MapService } from '../_services/map/map.service';
import { GeoDataService } from '../_services/geo-data/geo-data.service';
import { ObjectsService } from '../_services/objects/objects.service';

import Map from 'ol/Map';
import { Coordinate } from 'ol/coordinate';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Geometry, Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { Icon, Style } from 'ol/style';
import { easeOut } from 'ol/easing';
import { Address } from '../_models/geoData';

@Component({
  selector: 'app-object-add',
  standalone: true,
  imports: [
    BackdropComponent,
    ReactiveFormsModule,
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatDividerModule,
    MatSelectModule,
    MatIconModule,
    FormsModule,
    MatAutocompleteModule,
  ],
  templateUrl: './object-add.component.html',
  styleUrl: './object-add.component.scss',
})
export class ObjectAddComponent {
  @ViewChild('mapContainer') mapContainer: ElementRef | undefined;
  @ViewChild('searchInput') searchInput: ElementRef | undefined;

  addObjectForm1stage!: FormGroup;
  addObjectForm2stage!: FormGroup;
  searchForm!: FormGroup;

  searchValuePlaces: Address[] = [];

  country: string | undefined;
  place: string | undefined;
  coordinateLonLat!: Coordinate;
  private username: string | undefined;

  private map: Map | undefined;
  private vectorSource: VectorSource | undefined;
  private vectorLayer: VectorLayer<Feature<Geometry>> | undefined;

  categories: string[] = Object.keys(ObjectCategory);

  private searchFormValueSubscription: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private mapService: MapService,
    private geoDataService: GeoDataService,
    private objectsService: ObjectsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createSearchForm();
    this.createForm1stage();
    this.createForm2stage();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngAfterViewChecked() {
    this.map?.setTarget(this.mapContainer?.nativeElement);
  }

  initMap(): void {
    this.map = this.mapService.getNewMap();
    this.map.setTarget(this.mapContainer?.nativeElement);
    this.map.getView().setMaxZoom(18);

    this.vectorSource = new VectorSource();
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });
    this.map?.addLayer(this.vectorLayer);

    this.map.on('singleclick', (clickEvent) => {
      this.clearSearchForm();
      this.setNewPoint(clickEvent.coordinate);
    });
  }

  createForm1stage(): void {
    this.addObjectForm1stage = this.formBuilder.group({
      coordinateLon: [{ value: '', disabled: true }, Validators.required],
      coordinateLat: [{ value: '', disabled: true }, Validators.required],
    });
  }

  createSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      search: [''],
    });

    this.searchFormValueSubscription = this.searchForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(({ search }) => {
        this.onSearch(search);
      });
  }

  clearSearchForm(): void {
    if (!this.searchForm.value && this.searchValuePlaces.length === 0) return;
    this.searchForm.get('search')?.setValue('');
    this.searchValuePlaces = [];
  }

  isClearBtnDisabled(): boolean {
    if (this.searchValuePlaces.length !== 0 || this.searchForm.value !== '') {
      return false;
    }
    return true;
  }

  onSearch(searchQuery: string): void {
    if (!searchQuery) {
      this.searchValuePlaces = [];
      return;
    }
    this.geoDataService
      .getAddresses(searchQuery)
      .subscribe((result: Address[]) => {
        this.searchValuePlaces = result;

        if (result.length === 0) {
          this.searchForm.get('search')?.setErrors({ noPlaceFound: true });
          this.searchForm.get('search')?.markAsTouched();
        }
      });
  }

  getOptionText(option: any) {
    return option.displayName;
  }

  onSearchPlaceSelect(event: any): void {
    setTimeout(() => {
      this.searchInput?.nativeElement.blur();
    }, 0);
    const lon = +event.option.value.lon;
    const lat = +event.option.value.lat;
    const coordinate = fromLonLat([lon, lat]);
    const view = this.map?.getView();
    view?.animate(
      {
        center: coordinate,
        zoom: 14,
        duration: 500,
        easing: easeOut,
      },
      (isAnimationFinished: boolean) => {
        if (isAnimationFinished) {
          this.setNewPoint(coordinate);
        }
      }
    );
  }

  setNewPoint(coordinate: Coordinate): void {
    this.coordinateLonLat = toLonLat(coordinate);
    this.addObjectForm1stage.setValue({
      coordinateLon: this.coordinateLonLat[0].toString(),
      coordinateLat: this.coordinateLonLat[1].toString(),
    });
    this.createMarker(coordinate);
    this.getLocationData();
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

  getLocationData(): void {
    this.geoDataService
      .getGeoData([this.coordinateLonLat[1], this.coordinateLonLat[0]])
      .subscribe(({ countryName, place }) => {
        this.country = countryName || 'unknown';
        this.place = place || 'unknown';
        this.addObjectForm2stage.get('location')?.setValue({
          country: this.country,
          place: this.place,
        });
      });
  }

  isValid1stage() {
    return (
      !!this.addObjectForm1stage.value.coordinateLon &&
      !!this.addObjectForm1stage.value.coordinateLat
    );
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
        place: [
          {
            value: this.place,
            disabled: true,
          },
          [Validators.required],
        ],
      }),
      imageUrl: [undefined],
    });
  }

  onSubmit(): void {
    const form1Value = this.addObjectForm1stage.value;
    const coordinate = [
      Number(form1Value.coordinateLon),
      Number(form1Value.coordinateLat),
    ];

    const form2RawValue = this.addObjectForm2stage.getRawValue();
    const newObject: ObjectData = {
      ...form2RawValue,
      username: 'newuser',
      location: {
        ...form2RawValue.location,
        coordinateLonLat: coordinate,
      },
      status: ObjectStatus.NEW,
    };
    if (!newObject.imageUrl) {
      delete newObject.imageUrl;
    }
    this.objectsService.addNewObject(newObject);
  }

  onClose(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.searchFormValueSubscription?.unsubscribe();
  }
}
