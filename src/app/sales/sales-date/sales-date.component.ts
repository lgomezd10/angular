import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Sale } from '../sale';
import { SalesService } from '../sales.service';
import { dates } from 'src/app/tools/dates';
import { ProductPipe } from '@app/product/product.pipe';
import { ToolsModule } from "@app/tools/tools.module";
import { Observable, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProductsService } from '@app/product/products.service';
import { Product } from '@app/product/product';

@Component({
    selector: 'app-sales-date',
    templateUrl: './sales-date.component.html',
    styleUrls: ['./sales-date.component.css'],
    providers: [DatePipe],
    standalone: true,
    imports: [ProductPipe, DecimalPipe, ToolsModule, DatePipe, TableModule, ProgressSpinnerModule]
})
export class SalesDateComponent implements AfterViewInit {
  sales$: Observable<Sale[]>;
  total: number = 0;
  loading: boolean = false;
  sales: Sale[] = [];
  products: Product[] = [];


  constructor(private datePipe: DatePipe, private salesService: SalesService, private productsService: ProductsService, private cdr: ChangeDetectorRef) {

   }
  ngAfterViewInit(): void {
    this.products = this.productsService.getProducts();
  }

  getProductName(id: any): string {
    console.log('getProductName llamado con id:', id);
    const product = this.products.find(p => p.id === id);
    console.log('Producto encontrado:', product);
    return product ? product.name : 'Desconocido';
  }

  findSales(dates: dates) {
    this.total = 0;
    this.loading = true;
    this.salesService.salesByDate(dates.from, dates.to).subscribe(
      sales => {
        sales.forEach(element => {
          element.itemsSale.forEach(e => {
            this.total += e.price * e.quantity;
          });
        });
        this.sales = sales;
        this.loading = false;
      }
    );
  }

}

