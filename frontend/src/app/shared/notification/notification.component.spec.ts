import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationComponent } from './notification.component';
import { NotificationService } from '../../core/services/notification.service';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the message emitted by NotificationService', () => {
    notificationService.show('Hello world', 'success');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Hello world');
  });

  it('renders nothing when there is no active message', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.global-notification')).toBeNull();
  });

  it('applies the success class for success notifications', () => {
    notificationService.show('Saved', 'success');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.global-notification.success')).not.toBeNull();
    expect(el.querySelector('.global-notification.error')).toBeNull();
  });

  it('applies the error class for error notifications', () => {
    notificationService.show('Something failed', 'error');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.global-notification.error')).not.toBeNull();
    expect(el.querySelector('.global-notification.success')).toBeNull();
  });
});
