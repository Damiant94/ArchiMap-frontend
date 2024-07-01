import { Component } from '@angular/core';
import { ObjectsListElementComponent } from './objects-list-element/objects-list-element.component';
import { ObjectsService } from '../_services/objects/objects.service';
import { ObjectData } from '../_models/objectData';
import { Subscription, switchMap } from 'rxjs';
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
  isScrollFetchingBlocked: boolean = false;
  isLoadingList = false;

  filtersChangedSubscription: Subscription | undefined;
  getObjectsSubscription: Subscription | undefined;
  getObjectsOnScrollSubscription: Subscription | undefined;

  ngOnInit() {
    this.isLoadingList = true;
    this.getObjectsSubscription = this.objectsService.getObjects().subscribe({
      next: (objects: ObjectData[]) => {
        this.objects = objects;
        this.isLoadingList = false;
      },
    });
    this.filtersChangedSubscription = this.objectsService.filtersChangedSubject
      .pipe(
        switchMap(() => {
          this.isLoadingList = true;
          this.objectsService.resetPage();
          return this.objectsService.getObjects();
        })
      )
      .subscribe({
        next: (objects: ObjectData[]) => {
          this.objects = objects;
          this.isLoadingList = false;
          this.isScrollFetchingBlocked = false;
        },
      });
  }

  onScrollBottom(event: any) {
    if (this.isScrollFetchingBlocked) return;
    const { scrollTop, scrollHeight, offsetHeight } = event.target;
    if (scrollTop > scrollHeight - offsetHeight - 50) {
      this.objectsService.setNextPage();
      this.getObjectsOnScrollSubscription = this.objectsService
        .getObjects()
        .subscribe({
          next: (objects: ObjectData[]) => {
            if (objects.length === 0) {
              this.isScrollFetchingBlocked = true;
              return;
            }
            this.objects = this.objects?.concat(objects);
          },
        });
    }
  }

  ngOnDestroy() {
    this.filtersChangedSubscription?.unsubscribe();
    this.getObjectsSubscription?.unsubscribe();
    this.getObjectsOnScrollSubscription?.unsubscribe();
  }
}
