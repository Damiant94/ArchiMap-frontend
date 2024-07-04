import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { unknownRouteGuard } from './unknown-route.guard';
import { ToastrService } from 'ngx-toastr';

describe('unknownRouteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => unknownRouteGuard(...guardParameters));

  let routerMock: Router;
  let toastrServiceMock: ToastrService;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj<Router>('Router', {
      navigate: undefined,
    });

    toastrServiceMock = jasmine.createSpyObj<ToastrService>('ToastrService', {
      warning: undefined,
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ToastrService, useValue: toastrServiceMock },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
