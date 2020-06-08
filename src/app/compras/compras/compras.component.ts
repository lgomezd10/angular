import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/producto/productos.service';
import { Compra } from '../compra';
import { Observable, BehaviorSubject } from 'rxjs';
import { Producto } from 'src/app/producto/producto';
import { ComprasService } from '../compras.service';
import { Boton } from 'src/app/herramientas/boton';
import { HerramientasService } from 'src/app/herramientas/herramientas.service';

const nombreBotones = {enviarCompra:'EnviarCompra', crearProducto:'CrearProducto', addProducto:'AddProducto', add:'Add'};

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

  compras: Compra[] = [];
  compraActual: Compra;
  searchText: string;
  productos$: Observable<Producto[]>;
  mostrarNuevo: boolean = false;
  mostrarNuevoProducto: boolean = false;
  total: number = 0;
  compraFinalizada: boolean = false;
  myDateValue: Date = new Date();
  botones: Boton[] = [
    {id:nombreBotones.enviarCompra, nombre:"Enviar compra", mostrar:false},
    {id:nombreBotones.crearProducto, nombre: "Crear producto", mostrar:true},
    {id:nombreBotones.addProducto, nombre:"Añadir producto", mostrar: true},
    {id:nombreBotones.add, nombre:"Añadir", mostrar:false}    
  ];

  constructor(private productosService: ProductosService, private comprasService: ComprasService, private herramientasServices: HerramientasService) { }

  ngOnInit() {
    this.productos$ = this.productosService.getProductos$();
  }

  cambiarBoton(id: string, mostrar: boolean) {    
     this.botones.find(boton => { return boton.id == id}).mostrar = mostrar;
     
  }

  activarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = true;
  }

  desactivarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = false;
  }
  mostrarBoton(boton: string) {
    if (boton == nombreBotones.addProducto) {
      this.nuevoProducto();
      this.desactivarBoton(boton);
      this.activarBoton(nombreBotones.add);
      this.activarBoton(nombreBotones.crearProducto);
      this.mostrarNuevoProducto = false;
    }
    if (boton== nombreBotones.crearProducto) {      
      this.desactivarBoton(boton);
      this.activarBoton(nombreBotones.addProducto);
      this.desactivarBoton(nombreBotones.add);
      this.mostrarNuevoProducto = true;
      this.mostrarNuevo = false;
    }
    if (boton == nombreBotones.add){
      this.cargar();      
    }
    if (boton == nombreBotones.enviarCompra) {      
      this.enviarCompra();
    }
  }

  cargar() {
    if (this.compraActual.producto == null) {
      alert("Seleccione un producto");
    }
    else if (this.compraActual.cantidad <= 0 || this.compraActual.precio <= 0) {
      alert("La cantidad y el precio debe ser mayor que 0");
    }
    else {
      let compra = this.compras.find(compra => compra.producto.nombre == this.compraActual.producto.nombre);

      if (compra == undefined || compra.precio != this.compraActual.precio) {
        this.compras.push(this.compraActual);
      } else {
        compra.cantidad = compra.cantidad + this.compraActual.cantidad;
      }
      this.total = this.totalCompra();
      this.mostrarNuevo = false;
      this.activarBoton(nombreBotones.addProducto);
      this.desactivarBoton(nombreBotones.add);
      this.activarBoton(nombreBotones.enviarCompra);
    }
  }

  nuevoProducto() {
    this.compraActual = new Compra();
    this.mostrarNuevo = true;
    this.searchText = "";
  }

  totalCompra(): number {
    let suma = 0;
    this.compras.forEach(compra => {      
      let cantidad = compra.precio * compra.cantidad;
      cantidad = Math.round(cantidad * 100) / 100;
      suma = Math.round((suma + cantidad) * 100) / 100;
    });
    return suma;
  }

  eliminarCompra(compra: Compra) {
    this.compras.splice(this.compras.indexOf(compra), 1);
    this.total = this.totalCompra();
  }

  enviarCompra() {
    console.log(this.myDateValue);
    if(this.compras.length == 0)
      alert("No hay productos comprados");
    else {
      this.comprasService.guardarCompra(this.compras).subscribe(resp => this.compraFinalizada = true);
      this.desactivarBoton(nombreBotones.addProducto);
      this.desactivarBoton(nombreBotones.crearProducto);
      this.desactivarBoton(nombreBotones.enviarCompra);
    }
  }

  agregarProducto() {
    this.mostrarNuevoProducto = true;
  }

  procesarKeyup(key: KeyboardEvent, campo: HTMLElement) {
    if(key.keyCode == 13) { // press Enter      
      if (document.getElementById("enviar") == campo) {
        console.log("Se va a enviar el foco a lista-botones", "Añadir");
        this.herramientasServices.activarFoco(nombreBotones.add);
      } else {
        campo.focus();
      }
    }
  }

  onChange(e,campo) {
    campo.focus();
  }

}
