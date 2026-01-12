import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';
import { of, throwError, delay as rxjsDelay } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  return next(req).pipe(
    retry({
      count: 3,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        if (error.status === 0) {
          return of(null).pipe(rxjsDelay(1000));
        } else {
          return throwError(() => error);
        }
      },
    }),
    catchError(error => {
      errorService.showErrorInApp(error);
      return throwError(() => error);
    })
  );
};