import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '@app/services/socket';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  mensaje$: BehaviorSubject<string>;
  mensaje404$: BehaviorSubject<string>;

  constructor(private router: Router, private socket: SocketService) {

    this.mensaje$ = new BehaviorSubject('');
    this.mensaje404$ = new BehaviorSubject('');
  }

  connectedSocket$() : Observable<boolean> {
    return this.socket.connectedSocket$();
  }

  connectingSocket$() : Observable<boolean> {
    return this.socket.connectingSocket$();
  }

  getError$(): Observable<string> {
    return this.mensaje$.asObservable();
  }

  getError404$(): Observable<string> {
    return this.mensaje404$.asObservable();
  }

  show(mensaje: string) {
    this.mensaje$.next(mensaje);
  }

  showErrorInApp(error: any) {
    let errorMessage = '';
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede contactar con el servidor';
          break;
        case 401:
          this.router.navigate(['/login']);
          break;
        case 400:
          errorMessage = error.error.message;
          break;
        case 404:
          this.showError404(this.getMessageError(error.error.message));
          break;
        case 409:
          this.showError404('Registro duplicado');
          break;
        default:
          if (error.error.message == undefined) {
            errorMessage = `Server-side error: ${error.status} ${error.message}`;
          } else {
            errorMessage = `Server-side error: ${error.status} ${error.message} ${error.error.message}`;
          }
      }
    } else if (error instanceof ErrorEvent) {
      errorMessage = 'Ha ocurrido un error inesperado en la aplicación. Por favor, contacte con el administrador.';
      console.log('DESDE HTTP INTERCEPTOR RECIBIDO ERROREVENT', error.error.message, error);
    } else {
      console.log('DESDE HTTP INTERCEPTOR RECIBIDO OTRO TIPO DE ERROR', error);
      errorMessage = 'Ha ocurrido un error inesperado en la aplicación. Por favor, contacte con el administrador.';
    }
    if (errorMessage) {
      this.show(errorMessage);
    }
  }

  getMessageError(message: string): string {
    switch (message) {
      case 'Sale not found':
        return 'No se ha entrado la venta';
      case 'Product not found':
        return 'No se ha encontrado el producto';
      case 'Purchase not found':
        return 'No se ha encontrado la compra';
      case 'No sales found':
        return 'No se han encontrado ventas en las fechas indicadas';
      case 'No purchases found':
        return 'No se han encontrado compras en las fechas indicadas';
      default:
        return message;
    }
  }

  showError404(mensaje: string) {
    this.mensaje404$.next(mensaje);
  }

  reset() {
    this.mensaje$.next("");
    this.mensaje404$.next("");
  }

}
