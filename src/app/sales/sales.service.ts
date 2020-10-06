import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sale } from './sale';
import { Observable, BehaviorSubject } from 'rxjs';
import { Sales } from './sales';
import { ProductsService } from '../product/products.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

class ResponseSavedSales {
  message: string;
  salesId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {


  constructor(private http: HttpClient, private productsService: ProductsService) { }

  backendUrl = 'http://localhost:3000';

  saveSales(sales: Sale[], creditCard: boolean): Observable<number> {
    let envio = {
      creditCard:  creditCard,
      sale: sales
    }    
    var response: BehaviorSubject<number> = new BehaviorSubject(0);
    this.http.post<ResponseSavedSales>(this.backendUrl + '/sales/', envio, httpOptions).subscribe(resp => {
      response.next(resp.salesId);
    });
    return response;
  }


  updateSales(salesId: number, sales: Sale[], creditCard: boolean): Observable<number> {
    let envio = {
      salesId: salesId,
      creditCard:  creditCard,
      sales: sales
    }
    var response: BehaviorSubject<number> = new BehaviorSubject(0);
    this.http.post<ResponseSavedSales>(this.backendUrl + '/sales/update/' + salesId, envio, httpOptions).subscribe(resp => {
      response.next(resp.salesId); 
    });
    return response;
  }

  obtenerSale(salesId: number) : BehaviorSubject<Sales> {
    let response: BehaviorSubject<Sales> = new BehaviorSubject(new Sales());
    this.http.get<Sales>(this.backendUrl + '/sales/sale/' + salesId).subscribe(resp => {
      response.next(resp);
    });

    return response;
  }

  salesAListaSale(sales: Sales): Sale[] {
    let salida: Sale[] = [];
    let cont: number = 0;
    sales.sale.forEach(sale => {
      let actual: Sale = new Sale;
      actual.product = this.productsService.getProduct(sale.id),
      actual.quantity = sale.quantity;
      actual.price = sale.price;
      salida[cont] = actual;
      cont++;
    });
    return salida;
  }


  salesByDate(from: string, to: string): Observable<Sales[]> {
    let dates = {from: from, to: to};
    return this.http.post<Sales[]>(this.backendUrl + '/sales/date', dates, httpOptions);
  }
}
