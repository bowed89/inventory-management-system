import { TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';

import { Notification, NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('defaults to type "error" when none is given', () => {
    const received: Notification[] = [];
    service.notification$.subscribe((n) => received.push(n));

    service.show('Something went wrong');

    expect(received).toEqual([{ message: 'Something went wrong', type: 'error' }]);
  });

  it('emits the requested type', () => {
    const received: Notification[] = [];
    service.notification$.subscribe((n) => received.push(n));

    service.show('Saved successfully', 'success');

    expect(received).toEqual([{ message: 'Saved successfully', type: 'success' }]);
  });

  it('clears the message automatically after the given duration', fakeAsync(() => {
    const received: Notification[] = [];
    service.notification$.subscribe((n) => received.push(n));

    service.show('Saved successfully', 'success', 1000);
    tick(999);
    expect(received).toEqual([{ message: 'Saved successfully', type: 'success' }]);

    tick(1);
    expect(received).toEqual([
      { message: 'Saved successfully', type: 'success' },
      { message: '', type: 'success' }
    ]);
  }));

  it('restarts the clear timer when a new message arrives before the previous one expires', fakeAsync(() => {
    const received: string[] = [];
    service.notification$.subscribe((n) => received.push(n.message));

    service.show('First', 'error', 1000);
    tick(500);
    service.show('Second', 'success', 1000);
    tick(500);

    // the first timer would have fired here if it hadn't been cleared
    expect(received).toEqual(['First', 'Second']);

    tick(500);
    expect(received).toEqual(['First', 'Second', '']);
  }));
});
