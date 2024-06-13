import { Component, Input } from '@angular/core';
import { ObjectData } from '../../_models/objectData';
import { ObjectsListElementComponent } from '../../objects-list/objects-list-element/objects-list-element.component';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-map-popup',
  standalone: true,
  imports: [ObjectsListElementComponent, MatTooltipModule],
  templateUrl: './map-popup.component.html',
  styleUrl: './map-popup.component.scss',
})
export class MapPopupComponent {
  @Input('objectData') objectData: ObjectData | undefined;

  constructor(private router: Router) {}

  openDetails(): void {
    this.router.navigate(['details', this.objectData?._id]);
  }
}
