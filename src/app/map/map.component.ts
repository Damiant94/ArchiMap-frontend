import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core';

import { ObjectData, ObjectDataMap } from '../_models/objectData';
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

  objectData: ObjectData | undefined;

  private map: Map | undefined;
  isLoading = true;

  private toggleShowMapSubscription: Subscription | undefined;
  private openPopupSubscription: Subscription | undefined;
  private objectsForMapChangedSubscription: Subscription | undefined;

  constructor(
    private elementRef: ElementRef,
    private mapService: MapService,
    private objectsService: ObjectsService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.toggleShowMapSubscription = this.mapService.toggleShowMapSubject.subscribe((isShowMap) => {
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

    this.openPopupSubscription = this.mapService.openPopupSubject
      .pipe(
        switchMap((objectData: ObjectDataMap) =>
          this.objectsService.getObjectById(objectData.id)
        )
      )
      .subscribe((objectData: ObjectData) => {
        this.objectData = objectData;
      });

    this.mapService.createNewVectorSource();
    this.objectsForMapChangedSubscription = this.objectsService.objectsForMapChangedSubject.subscribe(
      (objects: ObjectDataMap[] | undefined) => {
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
        this.objectData = undefined;
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
    this.openPopupSubscription?.unsubscribe();
    this.objectsForMapChangedSubscription?.unsubscribe();
  }
}
