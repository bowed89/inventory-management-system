import { TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('emits the message to subscribers', () => {
    const received: string[] = [];
    service.message$.subscribe((msg) => received.push(msg));

    service.show('Saved successfully');

    expect(received).toContain('Saved successfully');
  });

  it('clears the message automatically after the given duration', fakeAsync(() => {
    const received: string[] = [];
    service.message$.subscribe((msg) => received.push(msg));

    service.show('Saved successfully', 1000);
    tick(999);
    expect(received).toEqual(['Saved successfully']);

    tick(1);
    expect(received).toEqual(['Saved successfully', '']);
  }));

  it('restarts the clear timer when a new message arrives before the previous one expires', fakeAsync(() => {
    const received: string[] = [];
    service.message$.subscribe((msg) => received.push(msg));

    service.show('First', 1000);
    tick(500);
    service.show('Second', 1000);
    tick(500);

    // the first timer would have fired here if it hadn't been cleared
    expect(received).toEqual(['First', 'Second']);

    tick(500);
    expect(received).toEqual(['First', 'Second', '']);
  }));
});
