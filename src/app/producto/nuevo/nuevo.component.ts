import { Component, OnInit } from '@angular/core';
import { Producto } from '../producto';
import { ProductosService } from '../productos.service';
import { Observable } from 'rxjs';
import { TIPOS } from '../tipos-productos';
import { HerramientasService } from 'src/app/herramientas/herramientas.service';
import { Boton } from 'src/app/herramientas/boton';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  constructor(private productosService: ProductosService, private herramientasServices: HerramientasService) { }

  public tipos = TIPOS;

  productos$: Observable<Producto[]>;

  correcto = true;

  producto: Producto;

  enviado: boolean = false;

  botones$: Observable<Boton[]>;

  boton: Boton = {nombre:"Guardar nuevo", mostrar:true};

  ngOnInit() {
    this.producto = new Producto();
    this.productos$ =  this.productosService.getProductos$();
    this.herramientasServices.nuevoBoton(this.boton);
    this.herramientasServices.getPulsado$().subscribe(boton => {      
      if(boton == "Guardar nuevo") {
        this.guardarProducto();
      }
    });
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
      this.herramientasServices.eliminarBoton(this.boton);
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
