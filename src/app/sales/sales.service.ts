import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sale } from './sale';
import { Observable, BehaviorSubject } from 'rxjs';
import { Sales, ItemSales } from './sales';
import { ProductsService } from '../product/products.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

class ResponseSale {
  status: number;
  error: number;
  response: {
    actualizados: number[];
  }
}

class ObtenerSales {
  status: number;
  error: number;
  response: Sales;
}

class ResponseSales {
  status: number;
  error: number;
  response: Sales[];
  
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {


  constructor(private http: HttpClient, private productsService: ProductsService) { }

  backendUrl = 'http://localhost:3000';

  guardarSale(sales: Sale[], creditCard: boolean): Observable<number> {
    let envio = {
      creditCard:  creditCard?1:0,
      sales: sales
    }
    var respuesta: BehaviorSubject<number> = new BehaviorSubject(0);
    this.http.post<ResponseSale>(this.backendUrl + '/sale/', envio, httpOptions).subscribe(resp => {
      respuesta.next(resp.response.actualizados[0]);
      console.log("Response después de una sale", respuesta);
    });
    return respuesta;
  }


  actualizarSale(salesId: number, sales: Sale[], creditCard: boolean): Observable<number> {
    let envio = {
      salesId: salesId,
      creditCard:  creditCard?1:0,
      sales: sales
    }
    var respuesta: BehaviorSubject<number> = new BehaviorSubject(0);
    this.http.post<ResponseSale>(this.backendUrl + '/sale/' + salesId, envio, httpOptions).subscribe(resp => {
      respuesta.next(resp.response.actualizados[0]); // aquí hay que modificar la respuesta para que devuelva la lista
      console.log("Response después de una sale", respuesta);
    });
    return respuesta;
  }

  obtenerSale(salesId: number) : BehaviorSubject<Sales> {
    let respuesta: BehaviorSubject<Sales> = new BehaviorSubject(new Sales());
    this.http.get<ObtenerSales>(this.backendUrl + '/sale/' + salesId).subscribe(resp => {
      respuesta.next(resp.response);
    });

    return respuesta;
  }

  salesAListaSale(sales: Sales): Sale[] {
    let salida: Sale[] = [];
    let cont: number = 0;
    sales.elementos.forEach(sale => {
      let actual: Sale = new Sale;
      actual.product = this.productsService.getProduct(sale.id),
      actual.quantity = sale.quantity;
      actual.price = sale.price;
      salida[cont] = actual;
      cont++;
    });
    return salida;
  }


  salesPordates(from: string, to: string): BehaviorSubject<Sales[]> {
    let dates = {from: from, to: to};
    let respuesta: BehaviorSubject<Sales[]> = new BehaviorSubject([]);
    this.http.post<ResponseSales>(this.backendUrl + '/sales/', dates, httpOptions).subscribe(resp => {
      console.log(resp.response);
      respuesta.next(resp.response);
    });
    return respuesta;
  }
}
