import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Venta } from './venta';
import { Observable, BehaviorSubject } from 'rxjs';
import { Ventas } from './ventas';

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

class RespuestaVentas {
  status: number;
  error: number;
  response: Ventas[];
  
}

@Injectable({
  providedIn: 'root'
})
export class CajaService {


  constructor(private http: HttpClient) { }

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
