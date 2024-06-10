import { Component, Input } from '@angular/core';
import { ObjectsListElementComponent } from './objects-list-element/objects-list-element.component';
import { ObjectsService } from '../_services/objects/objects.service';
import { ObjectData } from '../_models/objectData';

@Component({
  selector: 'app-objects-list',
  standalone: true,
  imports: [ObjectsListElementComponent],
  templateUrl: './objects-list.component.html',
  styleUrl: './objects-list.component.scss',
})
export class ObjectsListComponent {
  constructor(private objectsService: ObjectsService) {}

  objects: ObjectData[] = [];

  ngOnInit() {
    this.objects = this.objectsService.getObjects;
    console.log(this.objects)
  }
}
