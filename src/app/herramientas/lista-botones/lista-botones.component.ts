import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Boton } from '../boton';

@Component({
  selector: 'app-lista-botones',
  templateUrl: './lista-botones.component.html',
  styleUrls: ['./lista-botones.component.scss']
})
export class ListaBotonesComponent implements OnInit {

  @Input() lista: Boton[] = [];

  @Output()
  enviarBoton = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit() {
  }

  onEnviar(boton: string) {
    this.enviarBoton.emit(boton);
  }

}
