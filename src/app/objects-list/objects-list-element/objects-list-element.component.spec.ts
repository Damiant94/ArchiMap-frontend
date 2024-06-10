import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectsListElementComponent } from './objects-list-element.component';

describe('ObjectsListElementComponent', () => {
  let component: ObjectsListElementComponent;
  let fixture: ComponentFixture<ObjectsListElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectsListElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectsListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
