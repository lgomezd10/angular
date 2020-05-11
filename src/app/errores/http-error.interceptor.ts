import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/internal/operators';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      retry(3),
      catchError(error => {
        let errorMessage = '';
        if (error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
        /*} else if (error instanceof HttpErrorResponse) {
          if (error.status === 500) {
            console.log("El error es", error);
          errorMessage = `Error del servidor: ${error.error.message}`;
          }*/
        }else {
          // backend error
          if (error.error.message != undefined) {
            errorMessage = `Server-side error: ${error.status} ${error.error.message}`;
          } else {
            errorMessage = `Server-side error: ${error.status} ${error.message}`;
          }
          
        }
        
        // aquí podrías agregar código que muestre el error en alguna parte fija de la pantalla.
        this.errorService.show(errorMessage);
        console.log('errore en interceptor', errorMessage);   
        return throwError(errorMessage);
      })
    );
  }
}