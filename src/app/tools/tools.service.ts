import { Injectable } from '@angular/core';
import { ButtonType } from './button-type';
import { BehaviorSubject, Observable } from 'rxjs';
import { ButtonListComponent } from './button-list/button-list.component';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  botones: ButtonType[] = [];
  buttons: BehaviorSubject<ButtonType[]> = new BehaviorSubject<ButtonType[]>(this.botones);
  pulsado$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  foco$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor() {
    /*this.buttons = new BehaviorSubject<ButtonType[]>(this.botones);
    this.pulsado$ = new BehaviorSubject<string>("");
    this.foco$ = new BehaviorSubject<string>("");*/
  }

  getButtonTypes$(): Observable<ButtonType[]> {
    return this.buttons;
  }

  getButtonTypes(): ButtonType[] {
    return this.buttons.getValue();
  }

  getPulsado$(): Observable<string> {
    return this.pulsado$;
  }

  getFoco$(): Observable<string> {
    return this.foco$;
  }

  activateFocus(boton: string) {
    this.foco$.next(boton);
  }

  crearButtonTypees(lista: ButtonType[]) {
    this.botones = lista;
    this.buttons.next(this.botones);
  }

  newButtonType(boton: ButtonType) {
    this.botones.push(boton);
    this.buttons.next(this.botones);
  }

  deleteButtonType(boton: ButtonType) {
    if (this.botones.find((b) => b.name === boton.name) != undefined) {
      this.botones.splice(this.botones.indexOf(boton), 1);
      this.buttons.next(this.botones);
    }
  }


  pushButtonType(boton: string) {
    this.pulsado$.next(boton);
    this.foco$.next("");
  }

  destroy() {

  }

}
