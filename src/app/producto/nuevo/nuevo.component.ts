import { Component, OnInit } from '@angular/core';
import { Producto } from '../producto';
import { ProductosService } from '../productos.service';
import { Observable } from 'rxjs';
import { TIPOS } from '../tipos-productos';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  constructor(private productosService: ProductosService) { }

  public tipos = TIPOS;

  productos$: Observable<Producto[]>;

  correcto = true;

  producto: Producto;

  enviado: boolean = false;

  ngOnInit() {
    this.producto = new Producto();
    this.productos$ =  this.productosService.getProductos$();
  }

  darFormato() {
    this.producto.nombre = this.producto.nombre.toLowerCase();
    this.producto.nombre = this.producto.nombre[0].toUpperCase() + this.producto.nombre.slice(1);
  }

  // JSON.parse (JSON.stringif para pasar el objeto por referencia
  guardarProducto() {
    if (this.producto.nombre != "" && this.producto.tipo !="") {
      this.darFormato();
      this.productosService.postNuevoProducto(JSON.parse (JSON.stringify (this.producto)));
      this.enviado=true;
    } else {
      this.correcto = false;
    }
    this.producto = new Producto();
  }

  procesarKeyup(key: KeyboardEvent, campo) {
    if(key.keyCode == 13) { // press Enter
      console.log("pulsada la tecla", key.keyCode);
      campo.focus();
    }
  }

  onChange(e,campo) {
    campo.focus();
  }

}
