import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectAddComponent } from './object-add.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { ObjectCategory } from '../_models/objectData';

describe('ObjectAddComponent', () => {
  let component: ObjectAddComponent;
  let fixture: ComponentFixture<ObjectAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectAddComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        provideToastr(),
      ],
      teardown: { destroyAfterEach: false },
    }).compileComponents();

    fixture = TestBed.createComponent(ObjectAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isValid1stage should be false on init', () => {
    expect(component.isValid1stage()).toBeFalse();
  });

  it('isValid1stage should be true when its filled', () => {
    component.addObjectForm1stage.setValue(form1Data);
    expect(component.isValid1stage()).toBeTrue();
  });

  it('form 2 should be valid when form is filled', () => {
    component.addObjectForm2stage.setValue(form2Data);
    expect(component.addObjectForm2stage.valid).toBeTrue();
  });

  it('form 2 should not be valid when form is not filled', () => {
    expect(component.addObjectForm2stage.valid).toBeFalse();
  });

  it('form 2 should not be valid when name is too short', () => {
    component.addObjectForm2stage.setValue(form2DataInvalidName);
    expect(component.addObjectForm2stage.valid).toBeFalse();
    expect(component.nameInput!.invalid).toBeTrue();
    expect(component.descriptionInput!.valid).toBeTrue();
  });

  it('form 2 should not be valid when description is too short', () => {
    component.addObjectForm2stage.setValue(form2DataInvalidDescription);
    expect(component.addObjectForm2stage.valid).toBeFalse();
    expect(component.descriptionInput!.invalid).toBeTrue();
    expect(component.nameInput!.valid).toBeTrue();
  });
});

const form1Data = {
  coordinateLon: 1,
  coordinateLat: 1,
};

const form2Data = {
  name: 'name',
  description: 'description',
  category: ObjectCategory.APARTMENT,
  location: {
    country: 'country',
    place: 'place',
  },
  imageUrl: 'imageUrl',
};

const form2DataInvalidName = {
  ...form2Data,
  name: 'n',
};

const form2DataInvalidDescription = {
  ...form2Data,
  description: 'd',
};
