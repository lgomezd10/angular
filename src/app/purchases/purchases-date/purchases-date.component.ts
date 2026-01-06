import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { PurchasesService } from '../purchases.service';
import { Purchase } from '../purchase';
import { dates } from 'src/app/tools/dates';
import { GroupBydatePipe } from '@app/tools/group-by.date.pipe';
import { ToolsModule } from '@app/tools/tools.module';
import { Observable } from 'rxjs';
import { FormControl, FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";

@Component({
    selector: 'app-purchases-date',
    templateUrl: './purchases-date.component.html',
    styleUrls: ['./purchases-date.component.css'],
    providers: [DatePipe],
    standalone: true,
    imports: [DecimalPipe, GroupBydatePipe, ToolsModule, AsyncPipe, FormsModule, TableModule]
})
export class PurchasesDateComponent {

  purchases$: Observable<Purchase[]>;

  constructor(private datePipe: DatePipe, private purchasesService: PurchasesService) {
  }

  escribirDatos(datos) {
    console.log(datos);
  }
  //2019-05-09 00:00:00

  findPurchases(dates: dates) {    
    this.purchases$ = this.purchasesService.purchasesByDate(dates.from, dates.to);
  }

}
