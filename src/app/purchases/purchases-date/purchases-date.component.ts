import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PurchasesService } from '../purchases.service';
import { Purchase } from '../purchases';
import { dates } from 'src/app/tools/dates';

@Component({
  selector: 'app-purchases-date',
  templateUrl: './purchases-date.component.html',
  styleUrls: ['./purchases-date.component.css'],
  providers: [DatePipe]
})
export class PurchasesDateComponent implements OnInit {


  purchases: Purchase[];

  constructor(private datePipe: DatePipe, private purchasesService: PurchasesService) {

  }

  ngOnInit() {
    this.purchases = [];
  }

  escribirDatos(datos) {
    console.log(datos);
  }
  //2019-05-09 00:00:00

  findPurchases(dates: dates) {
    
    this.purchasesService.purchasesByDate(dates.from, dates.to).subscribe(purchases => {
      this.purchases = purchases;
      console.log("Desde fechas compras ", this.purchases);
    });

  }

}
