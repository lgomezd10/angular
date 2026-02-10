import { Injectable } from '@angular/core';
import { ButtonType } from './button-type';
import { BehaviorSubject, Observable } from 'rxjs';
import { ErrorService } from '../errores/error.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  botones: ButtonType[] = [];
  buttons: BehaviorSubject<ButtonType[]> = new BehaviorSubject<ButtonType[]>(this.botones);
  pulsado$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(private readonly errorService: ErrorService) {
  }

  cleanShowErrorsComponent() {
    this.errorService.reset();
  }

  getButtonTypes$(): Observable<ButtonType[]> {
    return this.buttons;
  }

  setButtonTypes(buttons: ButtonType[]) {
    this.buttons.next(buttons);
  }

  getButtonTypes(): ButtonType[] {
    return this.buttons.getValue();
  }

  getPulsado$(): Observable<string> {
    return this.pulsado$;
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
    if (this.botones.some((b) => b.name === boton.name)) {
      this.botones.splice(this.botones.indexOf(boton), 1);
      this.buttons.next(this.botones);
    }
  }


  pushButtonType(boton: string) {
    this.pulsado$.next(boton);
  }

}
