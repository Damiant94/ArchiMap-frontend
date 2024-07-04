import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPopupComponent } from './map-popup.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideToastr } from 'ngx-toastr';

describe('MapPopupComponent', () => {
  let component: MapPopupComponent;
  let fixture: ComponentFixture<MapPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPopupComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideToastr(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
