import { Injectable } from '@angular/core';
import { ButtonType } from './button-type';
import { BehaviorSubject, Observable } from 'rxjs';
import { ButtonListComponent } from './button-list/button-list.component';

@Injectable({
  providedIn: 'root'
})
export class toolsService {

  botones: ButtonType[] = [];
  botones$: BehaviorSubject<ButtonType[]> = new BehaviorSubject<ButtonType[]>(this.botones);
  pulsado$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  foco$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor() {
    /*this.botones$ = new BehaviorSubject<ButtonType[]>(this.botones);
    this.pulsado$ = new BehaviorSubject<string>("");
    this.foco$ = new BehaviorSubject<string>("");*/
  }

  getButtonTypees$(): Observable<ButtonType[]> {
    return this.botones$;
  }

  getButtonTypees(): ButtonType[]{
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

  crearButtonTypees(lista: ButtonType[]) {
    this.botones = lista;
    this.botones$.next(this.botones);
  }

  newButtonType(boton: ButtonType) {
    this.botones.push(boton);
    this.botones$.next(this.botones);
  }

  eliminarButtonType(boton: ButtonType) {
    if (this.botones.find((b) => b.name === boton.name ) != undefined) {
    this.botones.splice(this.botones.indexOf(boton),1);
    console.log("DESDE tools SERVICE. ButtonTypees en la lista:", this.botones);
    this.botones$.next(this.botones);
    } else {
      console.log("DESDE tools SERVICE. No se ha eliminado el boton porque no existe:", boton);
    }
  }

  limpiarButtonTypees(){
    this.botones = [];
    this.botones$.next(this.botones);
  }

  pulsarButtonType(boton: string) {
    this.pulsado$.next(boton);
    this.foco$.next("");
  }

  destroy(){

  }

}
