import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../productos.service';
import { Producto } from '../producto';
import { ActivatedRoute } from '@angular/router';
import { typeS } from '../types-productos';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Boton } from 'src/app/tools/boton';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {

  //private productos$: Observable<Producto[]>;
  producto: Producto;
  public types = typeS;
  botones: Boton[] = [
    {id:"Guardar" ,name:"Guardar", mostrar:true},
    {id:"Volver",name:"Volver", mostrar:true}
  ];

  constructor(private productosService: ProductosService, private route: ActivatedRoute, private location: Location) {
    this.route.paramMap.subscribe(params => {
      this.productosService.getProductos$().subscribe(productos => {
        this.producto = this.productosService.getProducto(+params.get('productoId')); 
      });      
    });
   }
  
  activarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = true;
  }

  desactivarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = false;
  }

  mostrarBoton(boton: string) {
    if (boton == "Volver") {
      this.volver();
    }
    if (boton == "Guardar") {
      this.modificarProducto();
    }    
  }

  modificarProducto() {
    if(this.producto.price <= 0)
      alert("el price debe ser mayor que 0");
    else 
      this.productosService.postModificarProducto(this.producto).subscribe(producto => {console.log("Respuesta tras guardar producto", producto);})
  }

  volver(){
    this.location.back();
  }

}
