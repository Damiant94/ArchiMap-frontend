import { Component } from '@angular/core';
import { ObjectsListElementComponent } from './objects-list-element/objects-list-element.component';
import { ObjectsService } from '../_services/objects/objects.service';
import { ObjectData } from '../_models/objectData';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-objects-list',
  standalone: true,
  imports: [ObjectsListElementComponent, MatProgressSpinnerModule],
  templateUrl: './objects-list.component.html',
  styleUrl: './objects-list.component.scss',
})
export class ObjectsListComponent {
  constructor(private objectsService: ObjectsService) {}

  objects: ObjectData[] | undefined;

  private objectsChangedSubscription: Subscription | undefined;

  ngOnInit() {
    this.objectsChangedSubscription =
      this.objectsService.objectsChangedSubject.subscribe(
        (objects: ObjectData[] | undefined) => {
          this.objects = objects;
          this.objectsService.isLoadingList = false;
        }
      );
  }

  get isLoadingList() {
    return this.objectsService.isLoadingList;
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
