import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Fechas } from '../fechas';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-seleccion-fechas',
  templateUrl: './seleccion-fechas.component.html',
  styleUrls: ['./seleccion-fechas.component.css']
})
export class SeleccionFechasComponent implements OnInit {

  desde: Date;
  hasta: Date;
  desdeString: string;
  hastaString: string;

  @Output()
  enviarFechas = new EventEmitter<Fechas>();

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.desde = new Date();
    this.hasta = new Date();
    this.desdeString = "";
    this.hastaString = "";
  }
  
  onEnviar() {
    this.desde.setHours(0,0,0);
    this.hasta.setHours(23,59,59);
    if (this.desde > this.hasta) {
      alert("La segunda fecha debe ser igual o mayor");
    } else {
      this.desdeString = this.datePipe.transform(this.desde, 'yyyy-MM-dd HH:mm:ss');
      this.hastaString = this.datePipe.transform(this.hasta, 'yyyy-MM-dd HH:mm:ss');      
      let fechas: Fechas = {
        desde: this.desdeString,
        hasta: this.hastaString
      }
      this.enviarFechas.emit(fechas);
    }
  }

}
