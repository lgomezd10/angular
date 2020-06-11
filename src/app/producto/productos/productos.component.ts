import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductosService } from '../productos.service';
import { Producto } from '../producto';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Boton } from 'src/app/herramientas/boton';



@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {  
  
  productos$: Observable<Producto[]>;
  nuevo = false;
  botones: Boton[] = [
    {id:"AddNuevo",nombre:"Añadir nuevo", mostrar:true}
  ];
  
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

  activarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = true;
  }

  desactivarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = false;
  }

  mostrarBoton(boton: string) {
    if (boton == "AddNuevo") {
      this.nuevo=true;
      this.desactivarBoton("AddNuevo");
      //this.desactivarBoton("Añadir nuevo");
    }
    
  }

  cambioPrecio(producto: Producto, precioAntiguo) {
    if(producto.precio <= 0) {
      
      alert("el precio debe ser mayor que 0");
    }
    else
      this.productosService.postModificarProducto(producto).subscribe(producto => {console.log(producto);});
  }  

  nuevoProductoGuardado(producto: Producto) {
    console.log("DESDE PRODUCTOS: Recibido evento de nuevo producto guardado");
    this.activarBoton("AddNuevo");
  }
  

  

}
