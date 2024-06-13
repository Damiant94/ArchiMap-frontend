import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { MapComponent } from './map/map.component';
import { ObjectsListComponent } from './objects-list/objects-list.component';
import { FiltersComponent } from './filters/filters.component';
import { MatIconModule } from '@angular/material/icon';
import { ObjectDetailsComponent } from './object-details/object-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ObjectsService } from './_services/objects/objects.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    MapComponent,
    ObjectsListComponent,
    FiltersComponent,
    MatIconModule,
    ObjectDetailsComponent,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private renderer: Renderer2,
    private objectsService: ObjectsService
  ) {}

  @ViewChild('objectsList') objectsList!: ElementRef<HTMLElement>;

  isShowList = true;

  ngOnInit() {
    this.objectsService.getObjects().subscribe();

    this.objectsService.hideListSubject.subscribe(() => {
      if (this.isShowList) {
        this.hideList();
      }
    });
  }

  showList(){
    this.isShowList = true;
    this.renderer.setStyle(this.objectsList.nativeElement, 'zIndex', '1');
  }

  hideList(){
    this.isShowList = false;
    this.renderer.setStyle(this.objectsList.nativeElement, 'zIndex', '0');
  }

  onToggle() {
    if (this.isShowList) {
      this.hideList();
      return;
    }
    this.showList();
  }
}
