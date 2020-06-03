import { Injectable } from '@angular/core';
import { Boton } from './boton';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListaBotonesComponent } from './lista-botones/lista-botones.component';

@Injectable({
  providedIn: 'root'
})
export class HerramientasService {

  botones: Boton[] = [];
  botones$: BehaviorSubject<Boton[]>;
  pulsado$: BehaviorSubject<string>;

  constructor() {
    this.botones$ = new BehaviorSubject<Boton[]>(this.botones);
    this.pulsado$ = new BehaviorSubject<string>("");
   }

   getBotones$(): Observable<Boton[]> {
    return this.botones$.asObservable();
  }

  getPulsado$() : Observable<string> {
    return this.pulsado$.asObservable();
  }

  crearBotones(lista: Boton[]) {
    this.botones = lista;
    this.botones$.next(this.botones);
  }

  nuevoBoton(boton: Boton) {
    this.botones.push(boton);
    this.botones$.next(this.botones);
  }

  eliminarBoton(boton: Boton) {
    this.botones.splice(this.botones.indexOf(boton),1);
  }

  limpiarBotones(){
    this.botones = [];
    this.botones$.next(this.botones);
  }

  pulsarBoton(boton: string) {
    this.pulsado$.next(boton);
  }

}
