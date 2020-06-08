import { Injectable } from '@angular/core';
import { Boton } from './boton';
import { BehaviorSubject, Observable } from 'rxjs';
import { ListaBotonesComponent } from './lista-botones/lista-botones.component';

@Injectable({
  providedIn: 'root'
})
export class HerramientasService {

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
    console.log("DESDE HERRAMIENTAS SEVICE: Entrando en activar foco del string", boton);
    console.log("Desde HERRAMIENTAS hay estos botones", this.botones$.getValue());
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
    this.botones.splice(this.botones.indexOf(boton),1);
    console.log("DESDE HERRAMIENTAS SERVICE. Botones en la lista:", this.botones);
    this.botones$.next(this.botones);
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
