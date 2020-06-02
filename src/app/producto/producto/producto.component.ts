import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../productos.service';
import { Producto } from '../producto';
import { ActivatedRoute } from '@angular/router';
import { TIPOS } from '../tipos-productos';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Boton } from 'src/app/herramientas/boton';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  private productos$: Observable<Producto[]>;
  private producto: Producto;
  public tipos = TIPOS;
  botones: Boton[] = [
    {nombre:"Guardar", mostrar:true},
    {nombre:"Volver", mostrar:true}
  ];

  constructor(private productosService: ProductosService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.productos$ = this.productosService.getProductos$();
    this.route.paramMap.subscribe(params => {
      this.productos$.subscribe(productos => {
        this.producto = productos.find(producto => { return producto.id_producto == (+params.get('productoId'))});
      });
      //this.producto = this.productosService.getProducto(+params.get('productoId'));
    });
   
  }

  activarBoton(nombreBoton: string) {
    this.botones.find(boton => { return boton.nombre == nombreBoton}).mostrar = true;
  }

  desactivarBoton(nombreBoton: string) {
    this.botones.find(boton => { return boton.nombre == nombreBoton}).mostrar = false;
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
    if(this.producto.precio <= 0)
      alert("el precio debe ser mayor que 0");
    else
      this.productosService.postModificarProducto(this.producto).subscribe(producto => {console.log(producto);})
  }

  volver(){
    this.location.back();
  }

}
