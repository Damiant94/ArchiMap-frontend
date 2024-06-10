import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
  @Input('isLast') isLast!: boolean;
  @ViewChild('container') container!: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    console.log(this.isLast);
  }

  ngAfterViewInit() {
    if (this.isLast) {
      this.renderer.setStyle(
        this.container.nativeElement,
        'border-bottom',
        'none'
      );
    }
  }
}
