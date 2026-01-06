import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '@app/auth/auth.service';
import { ErrorService } from '@app/errores/error.service';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Request Interceptor Invoked');
  const auth = inject(AuthService);
  const errorSrv = inject(ErrorService);

  const userValue = auth.userValue;
  errorSrv.reset();

  if (userValue) {
    const authReq = req.clone({
      setHeaders: {
        auth: userValue.token
      }
    });
    return next(authReq);
  }
  return next(req);
};