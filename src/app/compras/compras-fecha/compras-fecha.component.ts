import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ComprasService } from '../compras.service';
import { Compra } from '../compra';
import { Fechas } from 'src/app/herramientas/fechas';

@Component({
  selector: 'app-compras-fecha',
  templateUrl: './compras-fecha.component.html',
  styleUrls: ['./compras-fecha.component.css'],
  providers: [DatePipe]
})
export class ComprasFechaComponent implements OnInit {


  compras: Compra[];

  constructor(private datePipe: DatePipe, private comprasService: ComprasService) {

  }

  ngOnInit() {
    this.compras = [];
  }

  //2019-05-09 00:00:00

  buscarCompras(fechas: Fechas) {
    
    this.comprasService.comprasPorFechas(fechas.desde, fechas.hasta).subscribe(compras => {
      this.compras = compras;
    });

  }

}
