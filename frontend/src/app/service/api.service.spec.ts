import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ApiService);
  });

  afterEach(() => {
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
});
