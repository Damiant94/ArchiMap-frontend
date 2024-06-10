import { Component, Input } from '@angular/core';
import { ObjectData } from '../../_models/objectData';

@Component({
  selector: 'app-objects-list-element',
  standalone: true,
  imports: [],
  templateUrl: './objects-list-element.component.html',
  styleUrl: './objects-list-element.component.scss',
})
export class ObjectsListElementComponent {
  @Input({ required: true }) objectData!: ObjectData;
}
