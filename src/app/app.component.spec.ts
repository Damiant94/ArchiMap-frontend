import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MockComponent } from 'ng-mocks';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { FiltersComponent } from './filters/filters.component';
import { ObjectsListComponent } from './objects-list/objects-list.component';
import { MapComponent } from './map/map.component';
import { By } from '@angular/platform-browser';

const getComponentEl = (
  fixture: ComponentFixture<AppComponent>,
  component: any
) => {
  return fixture.debugElement.query(By.directive(component));
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      declarations: [
        MockComponent(NavbarComponent),
        MockComponent(FooterComponent),
        MockComponent(FiltersComponent),
        MockComponent(ObjectsListComponent),
        MockComponent(MapComponent),
      ],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render children components', () => {
    for (let childComponentClass of [
      NavbarComponent,
      FooterComponent,
      FiltersComponent,
      ObjectsListComponent,
      MapComponent,
    ]) {
      const childComponent = getComponentEl(
        fixture,
        childComponentClass
      ).componentInstance;
      expect(childComponent).toBeTruthy;
    }
  });
});
