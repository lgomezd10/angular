import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  mensaje$: BehaviorSubject<string>;
  mensaje404$: BehaviorSubject<string>;

  constructor() {

    this.mensaje$ = new BehaviorSubject('');
    this.mensaje404$ = new BehaviorSubject('');

   }

   getError$(): Observable<string> {
     return this.mensaje$.asObservable();
   }

   getError404$(): Observable<string> {
     return this.mensaje404$.asObservable();
   }

   show(mensaje: string) {
     this.mensaje$.next(this.mensaje$.getValue() + mensaje);
   }

  getMessageError(message: string): string {
    if (message == 'Sale not found') {
      return 'No se ha entrado la venta';
    } else if (message == 'Product not found') {
      return 'No se ha encontrado el producto';
    } else if (message == 'Purchase not found') {
      return 'No se ha encontrado la compra';
    } else if (message == 'No sales found') {
      return 'No se han encontrado ventas en las fechas indicadas';
    } else if (message == 'No purchases found') {
      return 'No se han encontrado compras en las fechas indicadas';
    } else {
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
