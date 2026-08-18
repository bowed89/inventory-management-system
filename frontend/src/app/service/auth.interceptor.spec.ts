import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { ApiService } from './api.service';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let apiService: ApiService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('attaches the Authorization header when a token is stored', () => {
    apiService.saveToStorage('token', 'abc123');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('does not attach an Authorization header when there is no token', () => {
    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('logs out and redirects to /login on a 401 response', () => {
    apiService.saveToStorage('token', 'abc123');

    httpClient.get('/api/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(apiService.isAuthenticated()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('does not log out on non-401 errors', () => {
    apiService.saveToStorage('token', 'abc123');

    httpClient.get('/api/test').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/test');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(apiService.isAuthenticated()).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
