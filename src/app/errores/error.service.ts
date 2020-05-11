import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  mensaje$: BehaviorSubject<string>;

  constructor() {

    this.mensaje$ = new BehaviorSubject('');

   }

   getError$(): Observable<string> {
     return this.mensaje$.asObservable();
   }

   show(mensaje: string) {
     this.mensaje$.next(this.mensaje$.getValue() + mensaje);
   }
  
}
