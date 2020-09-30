import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { purchasesService } from '../purchases.service';
import { Compra } from '../purchases';
import { dates } from 'src/app/tools/dates';

@Component({
  selector: 'app-purchases-date',
  templateUrl: './purchases-date.component.html',
  styleUrls: ['./purchases-date.component.css'],
  providers: [DatePipe]
})
export class PurchasesDateComponent implements OnInit {


  purchases: Compra[];

  constructor(private datePipe: DatePipe, private purchasesService: purchasesService) {

  }

  ngOnInit() {
    this.purchases = [];
  }

  //2019-05-09 00:00:00

  buscarPurchases(dates: dates) {
    
    this.purchasesService.purchasesPordates(dates.from, dates.to).subscribe(purchases => {
      this.purchases = purchases;
    });

  }

}
