import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import Map from 'ol/Map';
import { MapService } from '../_services/map/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  template: '',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {

  private map: Map | undefined;

  constructor(private elementRef: ElementRef, private mapService: MapService) {}

  ngOnInit() {
    this.map = this.mapService.getMap();
    this.map.setTarget(this.elementRef.nativeElement);
  }
}
