import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const feedInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationsService = inject(ToastrService);
  const longResponseMessage =
    'Server platform spins down a free web service that goes 15 minutes without receiving inbound traffic. Platform spins the service back up whenever it next receives a request to process. Spinning up a service takes up to a minute, which causes a noticeable delay for incoming requests until the service is back up and running. Thanks for your patience.';

  let timer: any;
  const delayTime = 5000;
  timer = setTimeout(() => {
    notificationsService.info(longResponseMessage, "info", {timeOut: 20000});
  }, delayTime);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        clearTimeout(timer);
      }
    }),
    catchError((err) => {
      clearTimeout(timer);
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
