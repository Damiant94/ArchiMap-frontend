import { Component } from '@angular/core';
import { BackdropComponent } from '../backdrop/backdrop.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectsService } from '../_services/objects/objects.service';
import { ObjectCategory, ObjectData } from '../_models/objectData';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-object-details',
  standalone: true,
  imports: [BackdropComponent, CommonModule],
  templateUrl: './object-details.component.html',
  styleUrl: './object-details.component.scss',
})
export class ObjectDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private objectsService: ObjectsService
  ) {}

  id: string = '';
  objectData: ObjectData | undefined;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

    this.objectData = this.objectsService.getObjectById(this.id);
    if (!this.objectData) {
      this.router.navigate(['/']);
    }
  }

  getObjectCategoryIconUrl(category: ObjectCategory) {
    return this.objectsService.getObjectCategoryIconUrl(category);
  }
}
