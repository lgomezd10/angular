import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductosService } from '../productos.service';
import { Producto } from '../producto';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  
  
  productos$: Observable<Producto[]>;
  nuevo = false;
  
  constructor(private productosService: ProductosService, private route:ActivatedRoute) {
    /*route.url.subscribe(url => {
      if (this.productos == null) {
        this.productos$ = this.productosService.getProductos$();
        this.productos$.subscribe(productos => {
          this.productos = productos;
          this.nuevo = false;
        });
      }
    })*/
  }

  cambioPrecio(producto: Producto, precioAntiguo) {
    if(producto.precio <= 0) {
      
      alert("el precio debe ser mayor que 0");
    }
    else
      this.productosService.postModificarProducto(producto).subscribe(producto => {console.log(producto);});
  }
  
  

  ngOnInit() {
    console.log("pasa por init")
    this.productos$ = this.productosService.getProductos$().pipe(
      tap((value) => { this.nuevo = false; }),

    );
    /* this.productos$.subscribe(productos => {
      this.productos = productos;
      this.nuevo = false;
    }); */
  }

}
