import { Injectable } from '@angular/core';
import { Boton } from './boton';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListaBotonesComponent } from './lista-botones/lista-botones.component';

@Injectable({
  providedIn: 'root'
})
export class toolsService {

  botones: Boton[] = [];
  botones$: BehaviorSubject<Boton[]> = new BehaviorSubject<Boton[]>(this.botones);
  pulsado$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  foco$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor() {
    /*this.botones$ = new BehaviorSubject<Boton[]>(this.botones);
    this.pulsado$ = new BehaviorSubject<string>("");
    this.foco$ = new BehaviorSubject<string>("");*/
  }

  getBotones$(): Observable<Boton[]> {
    return this.botones$;
  }

  getBotones(): Boton[]{
    return this.botones$.getValue();
  }

  getPulsado$() : Observable<string> {
    return this.pulsado$;
  }

  getFoco$(): Observable<string> {
    return this.foco$;
  }

  activarFoco(boton: string) {
    console.log("DESDE tools SEVICE: Entrando en activar foco del string", boton);
    console.log("Desde tools hay estos botones", this.botones$.getValue());
    this.foco$.next(boton);
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
    if (this.botones.find((b) => b.name === boton.name ) != undefined) {
    this.botones.splice(this.botones.indexOf(boton),1);
    console.log("DESDE tools SERVICE. Botones en la lista:", this.botones);
    this.botones$.next(this.botones);
    } else {
      console.log("DESDE tools SERVICE. No se ha eliminado el boton porque no existe:", boton);
    }
  }

  limpiarBotones(){
    this.botones = [];
    this.botones$.next(this.botones);
  }

  pulsarBoton(boton: string) {
    this.pulsado$.next(boton);
    this.foco$.next("");
  }

  destroy(){

  }

}
