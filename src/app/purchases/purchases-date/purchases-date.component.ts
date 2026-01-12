import { Component } from '@angular/core';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { PurchasesService } from '../purchases.service';
import { Purchase } from '../purchase';
import { Dates } from 'src/app/tools/dates';
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
    providers: [],
    standalone: true,
    imports: [DecimalPipe, GroupBydatePipe, AsyncPipe, FormsModule, TableModule, ShowErrorsComponent, SelectionDatesComponent]
})
export class PurchasesDateComponent {

  purchases$: Observable<Purchase[]>;

  constructor(private purchasesService: PurchasesService) {
  }

  findPurchases(dates: Dates) {    
    this.purchases$ = this.purchasesService.purchasesByDate(dates.from, dates.to);
  }

}
