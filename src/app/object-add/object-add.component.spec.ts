import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectAddComponent } from './object-add.component';

describe('ObjectAddComponent', () => {
  let component: ObjectAddComponent;
  let fixture: ComponentFixture<ObjectAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
