import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { NotificationsService } from '../../_services/notifications/notifications.service';
import { inject } from '@angular/core';
import { NotificationType } from '../../_models/notifications';

export const feedInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationsService = inject(NotificationsService);
  const longResponseMessage =
    'Render spins down a Free web service that goes 15 minutes without receiving inbound traffic. Render spins the service back up whenever it next receives a request to process. Spinning up a service takes up to a minute, which causes a noticeable delay for incoming requests until the service is back up and running. For example, a browser page load will hang temporarily. Sorry for inconvenience.';

  let timer: any;
  const delayTime = 5000;
  timer = setTimeout(() => {
    notificationsService.pushNotification(
      longResponseMessage,
      NotificationType.INFO,
      20000
    );
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
        notificationsService.pushNotification(
          "Something went wrong.. Please check your internet connection..",
          NotificationType.WARN,
          20000
        );
      }
      return throwError(() => new Error(err));
    })
  );
};
