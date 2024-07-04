import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackdropComponent } from './backdrop.component';
import { Router } from '@angular/router';

describe('BackdropComponent', () => {
  let component: BackdropComponent;
  let fixture: ComponentFixture<BackdropComponent>;
  let routerMock: Router;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj<Router>('Router', {
      navigate: undefined,
    });

    await TestBed.configureTestingModule({
      imports: [BackdropComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(BackdropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "/" on click', () => {
    component.onBackdropClick();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
