import { Component, OnInit } from '@angular/core';
import { Producto } from '../producto';
import { ProductosService } from '../productos.service';
import { Observable, Subscription } from 'rxjs';
import { TIPOS } from '../tipos-productos';
import { HerramientasService } from 'src/app/herramientas/herramientas.service';
import { Boton } from 'src/app/herramientas/boton';
import { element } from 'protractor';

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

  _pulsadoSub: Subscription;

  boton: Boton = {id:"GuardarNuevo",nombre:"Guardar nuevo", mostrar:true};

  ngOnInit() {
    this.producto = new Producto();
    this.productos$ =  this.productosService.getProductos$();
    this.herramientasServices.nuevoBoton(this.boton);
    this._pulsadoSub = this.herramientasServices.getPulsado$().subscribe(boton => {      
      if(boton == "GuardarNuevo") {
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
      console.log("DESDE NUEVO COMPONENT GUARDAR PRODUCTO se ha guardado",this.producto.nombre);
    } else {
      this.correcto = false;
    }
    this.producto = new Producto();
  }

  procesarKeyup(key: KeyboardEvent, campo: HTMLElement) {
    if(key.keyCode == 13) { // press Enter      
      if (document.getElementById("enviar") == campo) {
        console.log("DESDE NUEVO COMPONENT Se va a enviar el foco a lista-botones", this.boton.id);
        this.herramientasServices.activarFoco(this.boton.id);
      } else {
        campo.focus();
      }
    }
  }

  onChange(e,campo) {
    campo.focus();
  }

  ngOnDestroy() {
    this._pulsadoSub.unsubscribe();
  }
 

}
