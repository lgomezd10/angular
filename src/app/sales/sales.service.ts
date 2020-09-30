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

class RespuestaSale {
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

class RespuestaSales {
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

  guardarSale(ventas: Sale[], tarjeta: boolean): Observable<number> {
    let envio = {
      tarjeta:  tarjeta?1:0,
      ventas: ventas
    }
    var respuesta: BehaviorSubject<number> = new BehaviorSubject(0);
    this.http.post<RespuestaSale>(this.backendUrl + '/venta/', envio, httpOptions).subscribe(resp => {
      respuesta.next(resp.response.actualizados[0]);
      console.log("Respuesta después de una venta", respuesta);
    });
    return respuesta;
  }


  actualizarSale(salesId: number, ventas: Sale[], tarjeta: boolean): Observable<number> {
    let envio = {
      salesId: salesId,
      tarjeta:  tarjeta?1:0,
      ventas: ventas
    }
    var respuesta: BehaviorSubject<number> = new BehaviorSubject(0);
    this.http.post<RespuestaSale>(this.backendUrl + '/venta/' + salesId, envio, httpOptions).subscribe(resp => {
      respuesta.next(resp.response.actualizados[0]); // aquí hay que modificar la respuesta para que devuelva la lista
      console.log("Respuesta después de una venta", respuesta);
    });
    return respuesta;
  }

  obtenerSale(salesId: number) : BehaviorSubject<Sales> {
    let respuesta: BehaviorSubject<Sales> = new BehaviorSubject(new Sales());
    this.http.get<ObtenerSales>(this.backendUrl + '/venta/' + salesId).subscribe(resp => {
      respuesta.next(resp.response);
    });

    return respuesta;
  }

  ventasAListaSale(ventas: Sales): Sale[] {
    let salida: Sale[] = [];
    let cont: number = 0;
    ventas.elementos.forEach(venta => {
      let actual: Sale = new Sale;
      actual.product = this.productsService.getProduct(venta.productId),
      actual.quantity = venta.quantity;
      actual.price = venta.price;
      salida[cont] = actual;
      cont++;
    });
    return salida;
  }


  ventasPordates(desde: string, hasta: string): BehaviorSubject<Sales[]> {
    let dates = {desde: desde, hasta: hasta};
    let respuesta: BehaviorSubject<Sales[]> = new BehaviorSubject([]);
    this.http.post<RespuestaSales>(this.backendUrl + '/ventas/', dates, httpOptions).subscribe(resp => {
      console.log(resp.response);
      respuesta.next(resp.response);
    });
    return respuesta;
  }
}
