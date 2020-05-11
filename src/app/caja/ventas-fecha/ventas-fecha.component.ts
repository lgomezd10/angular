import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Ventas } from '../ventas';
import { CajaService } from '../caja.service';
import { Fechas } from 'src/app/herramientas/fechas';

@Component({
  selector: 'app-ventas-fecha',
  templateUrl: './ventas-fecha.component.html',
  styleUrls: ['./ventas-fecha.component.css'],
  providers: [DatePipe]
})
export class VentasFechaComponent implements OnInit {

 
  ventas: Ventas[] =[];
  total: number;

  constructor(private datePipe: DatePipe, private cajaService: CajaService) { 
    
   }

  ngOnInit() {
       
  }

  //2019-05-09 00:00:00

  buscarCompras(fechas: Fechas) {
    this.total = 0;
    console.log("buscar ventas");

    this.cajaService.ventasPorFechas(fechas.desde, fechas.hasta).subscribe(ventas => {
      this.ventas = ventas;
      this.ventas.forEach(element => {
        element.elementos.forEach(e => {
          this.total += e.precio * e.cantidad;
        });
      });
    });
  } 

}
