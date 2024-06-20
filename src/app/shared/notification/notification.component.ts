import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { NotificationType } from '../../_models/notifications';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../../_services/notifications/notifications.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  messages: {message: string, type: NotificationType}[] = [];

  constructor(
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private notificationService: NotificationsService
  ) {
    this.messages = this.data.messages;
  }

  removeMessage(messageToRemove: string) {
    this.messages = this.messages.filter(message => {
      return message.message !== messageToRemove
    })
    this.notificationService.messages = this.notificationService.messages.filter(message => {
      return message.message !== messageToRemove
    })
    if (this.messages.length === 0) {
      this.snackBarRef.dismiss();
    }
  }
}
