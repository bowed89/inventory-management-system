import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  const token = apiService.getToken();
  const authorizedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        apiService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
