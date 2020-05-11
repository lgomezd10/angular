import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../productos.service';
import { Producto } from '../producto';
import { ActivatedRoute } from '@angular/router';
import { TIPOS } from '../tipos-productos';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  private productos$: Observable<Producto[]>;
  private producto: Producto;
  public tipos = TIPOS;

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
