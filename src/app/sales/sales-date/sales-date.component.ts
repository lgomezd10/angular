import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Sale } from '../sale';
import { SalesService } from '../sales.service';
import { dates } from 'src/app/tools/dates';
import { ProductPipe } from '@app/product/product.pipe';
import { ToolsModule } from "@app/tools/tools.module";
import { Observable, tap } from 'rxjs';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-sales-date',
    templateUrl: './sales-date.component.html',
    styleUrls: ['./sales-date.component.css'],
    providers: [DatePipe],
    standalone: true,
    imports: [ProductPipe, DecimalPipe, ToolsModule, AsyncPipe, DatePipe]
})
export class SalesDateComponent  {
  sales$: Observable<Sale[]>;
  total: number = 0;

  constructor(private datePipe: DatePipe, private salesService: SalesService) { }

  findSales(dates: dates) {
    this.total = 0;
    this.sales$ = this.salesService.salesByDate(dates.from, dates.to).pipe(
      tap(sales => {
        sales.forEach(element => {
          element.itemsSale.forEach(e => {
            this.total += e.price * e.quantity;
          });
        });
      })
    );
  }
}

