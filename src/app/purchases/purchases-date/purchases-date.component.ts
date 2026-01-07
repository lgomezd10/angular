import { Component } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { PurchasesService } from '../purchases.service';
import { Purchase } from '../purchase';
import { dates } from 'src/app/tools/dates';
import { GroupBydatePipe } from '@app/tools/group-by.date.pipe';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";
import { ShowErrorsComponent } from "@app/errores/show-errors/show-errors.component";
import { SelectionDatesComponent } from "@app/tools/select-dates/select-dates.component";

@Component({
    selector: 'app-purchases-date',
    templateUrl: './purchases-date.component.html',
    styleUrls: ['./purchases-date.component.css'],
    providers: [DatePipe],
    standalone: true,
    imports: [DecimalPipe, GroupBydatePipe, AsyncPipe, FormsModule, TableModule, ShowErrorsComponent, SelectionDatesComponent]
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
