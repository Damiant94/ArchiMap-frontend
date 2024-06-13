import { Component, Input } from '@angular/core';
import { ObjectData } from '../../_models/objectData';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MapService } from '../../_services/map/map.service';
import { ObjectsService } from '../../_services/objects/objects.service';

@Component({
  selector: 'app-objects-list-element',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatButtonModule],
  templateUrl: './objects-list-element.component.html',
  styleUrl: './objects-list-element.component.scss',
})
export class ObjectsListElementComponent {
  @Input({ required: true }) objectData: ObjectData | undefined;
  @Input({ required: true }) isLast: boolean | undefined;

  constructor(private router: Router, private mapService: MapService, private objectsService: ObjectsService) {}

  openDetails(): void {
    this.router.navigate(['details', this.objectData?._id]);
  }

  onAnimateToView(clickEvent: any) {
    clickEvent.stopPropagation();
    this.mapService.onAnimateToView(this.objectData!);
    this.objectsService.hideListSubject.next();
  }
}
