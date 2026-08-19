import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type NotificationType = 'success' | 'error';

export interface Notification {
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly notification$: Observable<Notification> = this.notificationSubject.asObservable();

  show(message: string, type: NotificationType = 'error', durationMs = 3000): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.notificationSubject.next({ message, type });
    this.timeoutId = setTimeout(() => this.notificationSubject.next({ message: '', type }), durationMs);
  }
}
