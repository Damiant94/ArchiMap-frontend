import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { FiltersComponent } from './filters.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ObjectsService } from '../_services/objects/objects.service';
import { Subject } from 'rxjs';
import { Filters } from '../_models/filters';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let objectsServiceMock: ObjectsService;

  beforeEach(async () => {
    objectsServiceMock = jasmine.createSpyObj<ObjectsService>(
      'ObjectsService',
      {
        setFilters: undefined,
      }
    );
    const filtersChangedSubject = new Subject<Filters>();
    objectsServiceMock.filtersChangedSubject = filtersChangedSubject;

    await TestBed.configureTestingModule({
      imports: [FiltersComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        provideToastr(),
      ],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filters be empty on init', () => {
    expect(component.isFiltersEmpty()).toBeTrue();
  });

  it('should filters not be empty after fill', () => {
    component.searchInput?.setValue('a');
    expect(component.isFiltersEmpty()).toBeFalse();
  });

  it('should filters be empty after fill and then reset', () => {
    component.searchInput?.setValue('a');
    component.onResetFilters();
    expect(component.isFiltersEmpty()).toBeTrue();
  });
});
