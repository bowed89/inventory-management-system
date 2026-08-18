import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageSubject = new Subject<string>();
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly message$: Observable<string> = this.messageSubject.asObservable();

  show(message: string, durationMs = 3000): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.messageSubject.next(message);
    this.timeoutId = setTimeout(() => this.messageSubject.next(''), durationMs);
  }
}
