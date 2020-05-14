import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Venta } from './venta';
import { Observable, BehaviorSubject } from 'rxjs';
import { Ventas, ItemVentas } from './ventas';
import { ProductosService } from '../producto/productos.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

class RespuestaVenta {
  status: number;
  error: number;
  response: {
    actualizados: number[];
  }
}

class ObtenerVentas {
  status: number;
  error: number;
  response: Ventas;
}

class RespuestaVentas {
  status: number;
  error: number;
  response: Ventas[];
  
}

@Injectable({
  providedIn: 'root'
})
export class CajaService {


  constructor(private http: HttpClient, private productosService: ProductosService) { }

  backendUrl = 'http://localhost:3000';

  guardarVenta(ventas: Venta[], tarjeta: boolean): Observable<number> {
    let envio = {
      tarjeta:  tarjeta?1:0,
      ventas: ventas
    }
    var respuesta: BehaviorSubject<number> = new BehaviorSubject(0);
    this.http.post<RespuestaVenta>(this.backendUrl + '/venta/', envio, httpOptions).subscribe(resp => {
      respuesta.next(resp.response.actualizados[0]);
      console.log("Respuesta después de una venta", respuesta);
    });
    return respuesta;
  }


  actualizarVenta(id_ventas: number, ventas: Venta[], tarjeta: boolean): Observable<number> {
    let envio = {
      id_ventas: id_ventas,
      tarjeta:  tarjeta?1:0,
      ventas: ventas
    }
    var respuesta: BehaviorSubject<number> = new BehaviorSubject(0);
    this.http.post<RespuestaVenta>(this.backendUrl + '/venta/' + id_ventas, envio, httpOptions).subscribe(resp => {
      respuesta.next(resp.response.actualizados[0]); // aquí hay que modificar la respuesta para que devuelva la lista
      console.log("Respuesta después de una venta", respuesta);
    });
    return respuesta;
  }

  obtenerVenta(id_ventas: number) : BehaviorSubject<Ventas> {
    let respuesta: BehaviorSubject<Ventas> = new BehaviorSubject(new Ventas());
    this.http.get<ObtenerVentas>(this.backendUrl + '/venta/' + id_ventas).subscribe(resp => {
      respuesta.next(resp.response);
    });

    return respuesta;
  }

  ventasAListaVenta(ventas: Ventas): Venta[] {
    let salida: Venta[] = [];
    let cont: number = 0;
    ventas.elementos.forEach(venta => {
      let actual: Venta = new Venta;
      actual.producto = this.productosService.getProducto(venta.id_producto),
      actual.cantidad = venta.cantidad;
      actual.precio = venta.precio;
      salida[cont] = actual;
      cont++;
    });
    return salida;
  }


  ventasPorFechas(desde: string, hasta: string): BehaviorSubject<Ventas[]> {
    let fechas = {desde: desde, hasta: hasta};
    let respuesta: BehaviorSubject<Ventas[]> = new BehaviorSubject([]);
    this.http.post<RespuestaVentas>(this.backendUrl + '/ventas/', fechas, httpOptions).subscribe(resp => {
      console.log(resp.response);
      respuesta.next(resp.response);
    });
    return respuesta;
  }
}
