import { Component, ElementRef, ViewChild } from '@angular/core';
import { ObjectsListElementComponent } from './objects-list-element/objects-list-element.component';
import { ObjectsService } from '../_services/objects/objects.service';
import { ObjectData } from '../_models/objectData';
import { Subscription, debounce, tap, timer } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-objects-list',
  standalone: true,
  imports: [ObjectsListElementComponent, MatProgressSpinnerModule],
  templateUrl: './objects-list.component.html',
  styleUrl: './objects-list.component.scss',
})
export class ObjectsListComponent {
  @ViewChild('container') container: ElementRef | undefined;
  constructor(private objectsService: ObjectsService) {}

  objects: ObjectData[] | undefined;
  isLoadingList: boolean = true;
  debounceTime = 500;

  private objectsChangedSubscription: Subscription | undefined;

  ngOnInit() {
    this.isLoadingList = true;
    this.objectsChangedSubscription =
      this.objectsService.objectsChangedSubject.subscribe(
        (objects: ObjectData[] | undefined) => {
          this.objects = objects;
          this.isLoadingList = false;
          this.objectsService.isLoadingListSubject.next(false);
        }
      );

    this.objectsService.filtersChangedSubject
      .pipe(
        tap((filters) => {
          if (filters.search === this.objectsService.filters.search) {
            this.debounceTime = 0;
          } else {
            this.debounceTime = 500;
          }
        }),
        debounce(() => timer(this.debounceTime))
      )
      .subscribe(() => {
        this.isLoadingList = true;
        this.objectsService.isLoadingListSubject.next(true);
      });
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
