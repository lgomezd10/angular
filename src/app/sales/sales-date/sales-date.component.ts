import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Sales } from '../sales';
import { SalesService } from '../sales.service';
import { dates } from 'src/app/tools/dates';

@Component({
  selector: 'app-sales-date',
  templateUrl: './sales-date.component.html',
  styleUrls: ['./sales-date.component.css'],
  providers: [DatePipe]
})
export class SalesDateComponent implements OnInit {

 
  ventas: Sales[] =[];
  total: number;

  constructor(private datePipe: DatePipe, private salesService: SalesService) { 
    
   }

  ngOnInit() {
       
  }

  //2019-05-09 00:00:00

  buscarpurchases(dates: dates) {
    this.total = 0;
    console.log("buscar ventas");

    this.salesService.ventasPordates(dates.desde, dates.hasta).subscribe(ventas => {
      this.ventas = ventas;
      this.ventas.forEach(element => {
        element.elementos.forEach(e => {
          this.total += e.price * e.quantity;
        });
      });
    });
  } 

}