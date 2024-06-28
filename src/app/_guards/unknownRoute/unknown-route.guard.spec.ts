import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { unknownRouteGuard } from './unknown-route.guard';

describe('unknownRouteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => unknownRouteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
