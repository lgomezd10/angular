import { Injectable } from '@angular/core';
import { HttpHandler, HttpRequest, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/internal/operators';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      retry(3),
      catchError(error => {
        let errorMessage = '';
        
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            errorMessage = "No se puede contactar con el servidor";
            this.errorService.show(errorMessage);
          } else
          if (error.status === 401) {
            this.router.navigate(['/login']);
          } else if (error.status === 404) {
            if (error.error.message == "Sale not found") {
              errorMessage = "No se ha entrado la venta"
            }
            else if (error.error.message == "Product not found") {
              errorMessage = "No se ha encontrado el producto"
            }
            else if (error.error.message == "Purchase not found") {
              errorMessage = "No se ha encontrado la compra"
            } else {
              errorMessage = error.error.message;
            }            
            this.errorService.showError404(errorMessage);
            window.alert(errorMessage);
          } else {
            // backend error
            if (error.error.message != undefined) {
              errorMessage = `Server-side error: ${error.status} ${error.message} ${error.error.message}`;
            } else {
              errorMessage = `Server-side error: ${error.status} ${error.message}`;
            }
            this.errorService.show(errorMessage);
          }
          
        } else if (error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
          /*} else if (error instanceof HttpErrorResponse) {
            if (error.status === 500) {
              console.log("El error es", error);
            errorMessage = `Error del servidor: ${error.error.message}`;
            }*/
            
            console.log("DESDE HTTP INTERCEPTOR RECIBIDO ERROREVENT", error);
        } else {
          console.log("DESDE HTTP INTERCEPTOR RECIBIDO OTRO TIPO DE ERROR", error);
          errorMessage = 'other errors';
        }
        return throwError(errorMessage);
        // aquí podrías agregar código que muestre el error en alguna parte fija de la pantalla.
        
        //console.log('errore en interceptor', errorMessage);

      })
    );
  }
}