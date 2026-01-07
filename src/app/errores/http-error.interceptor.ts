import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const router = inject(Router);
  return next(req).pipe(
    retry(3),
    catchError(error => {
      let errorMessage = '';
      if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          errorMessage = 'No se puede contactar con el servidor';
          errorService.show(errorMessage);
        } else if (error.status === 401) {
          router.navigate(['/login']);
        } else if (error.status === 400) {
          errorMessage = error.error.message;
          errorService.show(errorMessage);
        } else if (error.status === 404) {
          errorMessage = errorService.getMessageError(error.error.message);
          errorService.showError404(errorMessage);
        } else if (error.status === 409) {
          errorMessage = 'Registro duplicado';
          errorService.show(errorMessage);
        } else {
          if (error.error.message != undefined) {
            errorMessage = `Server-side error: ${error.status} ${error.message} ${error.error.message}`;
          } else {
            errorMessage = `Server-side error: ${error.status} ${error.message}`;
          }
          errorService.show(errorMessage);
        }
      } else if (error instanceof ErrorEvent) {
        errorMessage = `Client-side error: ${error.error.message}`;
        console.log('DESDE HTTP INTERCEPTOR RECIBIDO ERROREVENT', error);
      } else {
        console.log('DESDE HTTP INTERCEPTOR RECIBIDO OTRO TIPO DE ERROR', error);
        errorMessage = 'other errors';
      }
      return throwError(() => error);
    })
  );
};