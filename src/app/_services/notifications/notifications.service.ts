import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationComponent } from '../../shared/notification/notification.component';
import { NotificationType } from '../../_models/notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  messages: { message: string; type: NotificationType }[] = [];
  private snackBarRef: MatSnackBarRef<NotificationComponent> | undefined;
  private snackBarIsDisplayed: boolean = false;

  constructor(private snackBar: MatSnackBar) {}

  public pushNotification(
    message: string,
    type: NotificationType,
    duration: number = 2000
  ): void {
    if (
      !this.messages.find(
        (currentMessage) => currentMessage.message === message
      )
    ) {
      this.messages.push({ message, type });
      if (!this.snackBarIsDisplayed) {
        this.snackBarRef = this.snackBar.openFromComponent(
          NotificationComponent,
          {
            data: {
              messages: this.messages,
              duration: duration,
            },
          }
        );
        this.snackBarIsDisplayed = true;
      }
      setTimeout(
        () => this.snackBarRef?.instance.removeMessage(message),
        duration
      );

      this.snackBarRef?.afterDismissed().subscribe(() => {
        this.snackBarIsDisplayed = false;
      });
    }
  }
}
