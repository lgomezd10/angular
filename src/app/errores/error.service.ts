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

   showError404(mensaje: string) {
     this.mensaje404$.next(mensaje);
   }

   reset() {
     this.mensaje$.next("");
     this.mensaje404$.next("");
   }
  
}
