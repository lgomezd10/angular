import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Boton } from '../boton';
import { HerramientasService } from '../herramientas.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-botones',
  templateUrl: './lista-botones.component.html',
  styleUrls: ['./lista-botones.component.scss']
})
export class ListaBotonesComponent implements OnInit {

  @Input() lista: Boton[] = [];

  @Output()
  enviarBoton = new EventEmitter<string>();

  listaBotones$: Observable<Boton[]>;
  
  constructor(private herramientasServices: HerramientasService) { }

  ngOnInit() {
    this.herramientasServices.crearBotones(this.lista);
    this.listaBotones$ = this.herramientasServices.getBotones$();
  }

  onEnviar(boton: string) {
    this.enviarBoton.emit(boton);
    this.herramientasServices.pulsarBoton(boton);
  }

}
