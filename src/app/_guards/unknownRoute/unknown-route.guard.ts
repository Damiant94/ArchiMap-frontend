import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const unknownRouteGuard: CanActivateFn = (route, state) => {
  const notificationsService = inject(ToastrService);
  const router = inject(Router)
  notificationsService.warning(`Page not found`);
  router.navigate(["/"]);
  return true;
};
