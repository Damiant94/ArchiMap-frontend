import { Component, ElementRef, ViewChild } from '@angular/core';
import { ObjectsListElementComponent } from './objects-list-element/objects-list-element.component';
import { ObjectsService } from '../_services/objects/objects.service';
import { ObjectData } from '../_models/objectData';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-objects-list',
  standalone: true,
  imports: [ObjectsListElementComponent],
  templateUrl: './objects-list.component.html',
  styleUrl: './objects-list.component.scss',
})
export class ObjectsListComponent {
  @ViewChild('container') container: ElementRef | undefined;
  constructor(private objectsService: ObjectsService) {}

  objects: ObjectData[] | undefined;
  isLoading: boolean = true;

  private objectsChangedSubscription: Subscription | undefined;

  ngOnInit() {
    this.isLoading = true;
    this.objectsChangedSubscription =
      this.objectsService.objectsChangedSubject.subscribe(
        (objects: ObjectData[] | undefined) => {
          this.objects = objects;
          this.isLoading = false;
        }
      );
  }

  onScrollBottom(event: any) {
    if (this.objectsService.scrollFetchingBlocked) return;
    const { scrollTop, scrollHeight, offsetHeight } = event.target;
    if (scrollTop > scrollHeight - offsetHeight - 50) {
      this.objectsService.setNextPage();
      this.objectsService.getObjects().subscribe();
    }
  }

  ngOnDestroy() {
    this.objectsChangedSubscription?.unsubscribe();
  }
}
