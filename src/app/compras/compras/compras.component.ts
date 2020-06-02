import { Component, OnInit } from '@angular/core';
import { ProductosService } from 'src/app/producto/productos.service';
import { Compra } from '../compra';
import { Observable, BehaviorSubject } from 'rxjs';
import { Producto } from 'src/app/producto/producto';
import { ComprasService } from '../compras.service';
import { Boton } from 'src/app/herramientas/boton';

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
    {nombre:"Enviar compra", mostrar:false},
    {nombre:"Añadir producto", mostrar: true},
    {nombre:"Crear producto", mostrar:true},
    {nombre:"Añadir", mostrar:false}    
  ];

  constructor(private productosService: ProductosService, private comprasService: ComprasService) { }

  ngOnInit() {
    this.productos$ = this.productosService.getProductos$();
  }

  cambiarBoton(nombreBoton: string, mostrar: boolean) {    
     this.botones.find(boton => { return boton.nombre == nombreBoton}).mostrar = mostrar;
     
  }

  activarBoton(nombreBoton: string) {
    this.botones.find(boton => { return boton.nombre == nombreBoton}).mostrar = true;
  }

  desactivarBoton(nombreBoton: string) {
    this.botones.find(boton => { return boton.nombre == nombreBoton}).mostrar = false;
  }
  mostrarBoton(boton: string) {
    if (boton == "Añadir producto") {
      this.nuevoProducto();
      this.desactivarBoton(boton);
      this.activarBoton("Añadir");
      this.activarBoton("Crear producto");
      this.mostrarNuevoProducto = false;
    }
    if (boton== "Crear producto") {      
      this.desactivarBoton(boton);
      this.activarBoton("Añadir producto");
      this.desactivarBoton("Añadir");
      this.mostrarNuevoProducto = true;
      this.mostrarNuevo = false;
    }
    if (boton == "Añadir"){
      this.cargar();      
    }
    if (boton == "Enviar compra") {      
      this.enviarCompra();
    }
  }

  cargar() {    
    if (this.compraActual.producto == null){
      alert("Seleccione un producto");
    }
    else if (this.compraActual.cantidad <= 0 || this.compraActual.precio <=0){
      alert("La cantidad y el precio debe ser mayor que 0");
    }  
    else {
      this.compras.push(this.compraActual);
      this.total = this.totalCompra();
      this.mostrarNuevo = false;
      this.activarBoton("Añadir producto");
      this.desactivarBoton("Añadir");      
      this.activarBoton("Enviar compra");
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
      this.desactivarBoton("Añadir producto");
      this.desactivarBoton("Crear producto");
      this.desactivarBoton("Enviar compra");
    }
  }

  agregarProducto() {
    this.mostrarNuevoProducto = true;
  }

}
