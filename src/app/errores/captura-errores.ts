import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';

@Injectable({
    providedIn: 'root'
  })
export class CapturaErrores implements ErrorHandler {
    constructor(private errorServices: ErrorService) {

    }
    handleError(error: any) {
      if (error instanceof HttpErrorResponse) {
          //Backend returns unsuccessful response codes such as 404, 500 etc.
          let mensaje = 'Desde HE: Backend returned status code: ' + error.status	+ ' Response body: ' + error.message;
          //this.errorServices.show(mensaje); 
          console.log('errore en captura errores', mensaje, error);   
                 	  
      } else {
          //A client-side or network error occurred.
          let mensaje = 'Desde HE: An error occurred:' + error.message;	
          console.log('errore en captura errores', mensaje, error);
          console.log('error capturado',error);
      }     
    }
} 