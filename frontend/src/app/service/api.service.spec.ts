import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('saveToStorage stores the raw value in localStorage', () => {
    service.saveToStorage('token', 'my-jwt-token');
    expect(localStorage.getItem('token')).toBe('my-jwt-token');
  });

  it('isAuthenticated returns false when there is no token', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('isAuthenticated returns true once a token is saved', () => {
    service.saveToStorage('token', 'my-jwt-token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('isAdmin returns true only when the stored role is ADMIN', () => {
    service.saveToStorage('role', 'USER');
    expect(service.isAdmin()).toBeFalse();

    service.saveToStorage('role', 'ADMIN');
    expect(service.isAdmin()).toBeTrue();
  });

  it('logout clears token and role from storage', () => {
    service.saveToStorage('token', 'my-jwt-token');
    service.saveToStorage('role', 'ADMIN');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('getImageUrl builds an absolute URL from a relative backend path', () => {
    expect(service.getImageUrl('product-image/abc.jpg')).toBe('http://localhost:8080/product-image/abc.jpg');
  });

  it('getImageUrl passes through data/http urls unchanged', () => {
    expect(service.getImageUrl('data:image/png;base64,xyz')).toBe('data:image/png;base64,xyz');
    expect(service.getImageUrl('http://example.com/a.jpg')).toBe('http://example.com/a.jpg');
  });

  it('getImageUrl returns empty string for a missing url', () => {
    expect(service.getImageUrl(undefined)).toBe('');
    expect(service.getImageUrl(null)).toBe('');
    expect(service.getImageUrl('')).toBe('');
  });

  it('getAllProducts exposes the list under the generic ApiResponse data field', () => {
    let result: any;
    service.getAllProducts().subscribe((res) => (result = res));

    const req = httpMock.expectOne(`${environment.apiUrl}/api/products/all`);
    req.flush({
      status: 200,
      message: 'Success',
      data: [{ id: 1, name: 'Widget', sku: 'SKU-1', price: 10, stockQuantity: 5 }]
    });

    expect(result.status).toBe(200);
    expect(result.data.length).toBe(1);
    expect(result.data[0].name).toBe('Widget');
  });

  it('loginUser exposes token/role under data instead of top-level fields', () => {
    let result: any;
    service.loginUser({ email: 'a@a.com', password: 'secret' }).subscribe((res) => (result = res));

    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
    req.flush({
      status: 200,
      message: 'User logged in successfully',
      data: { token: 'jwt-token', role: 'ADMIN', expirationTime: '12 weeks' }
    });

    expect(result.data.token).toBe('jwt-token');
    expect(result.data.role).toBe('ADMIN');
  });
});
