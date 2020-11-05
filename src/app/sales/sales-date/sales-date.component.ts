import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Sale } from '../sale';
import { SalesService } from '../sales.service';
import { dates } from 'src/app/tools/dates';

@Component({
  selector: 'app-sales-date',
  templateUrl: './sales-date.component.html',
  styleUrls: ['./sales-date.component.css'],
  providers: [DatePipe]
})
export class SalesDateComponent  {

 
  sales: Sale[] =[];
  total: number;

  constructor(private datePipe: DatePipe, private salesService: SalesService) { 
    
   }


  //2019-05-09 00:00:00

  findPurchases(dates: dates) {
    this.total = 0;
    this.salesService.salesByDate(dates.from, dates.to).subscribe(sales => {
      this.sales = sales;
      this.sales.forEach(element => {
        element.itemsSale.forEach(e => {
          this.total += e.price * e.quantity;
        });
      });
    });
  } 

}

