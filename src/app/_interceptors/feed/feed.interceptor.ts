import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const feedInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationsService = inject(ToastrService);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 0 || err.status === 500) {
        notificationsService.error(
          'Something went wrong.. Please check your internet connection..',
          'error'
        );
      }
      return throwError(() => new Error(err));
    })
  );
};
