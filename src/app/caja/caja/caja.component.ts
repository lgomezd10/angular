import { Component, OnInit } from '@angular/core';
import { Venta } from '../venta';
import { Producto } from 'src/app/producto/producto';
import { Observable } from 'rxjs';
import { ProductosService } from 'src/app/producto/productos.service';
import { CajaService } from '../caja.service';
import { Boton } from 'src/app/herramientas/boton';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {

  ventas: Venta[] = [];
  ventaActual: Venta;
  mostrarNuevo: boolean = false;  
  productos$: Observable<Producto[]>;  
  seleccionado: Producto;
  total: number=0;
  codigoVenta: number = 0;
  tarjeta: boolean = false;
  botones: Boton[] = [
    {nombre:"Nueva venta", mostrar:false},
    {nombre:"Finalizar venta", mostrar:false},
    {nombre:"Añadir producto", mostrar: true},
    {nombre:"Añadir", mostrar:false}      
  ];

  constructor(private productosService: ProductosService, private cajaService: CajaService) { }


  ngOnInit() {
    this.productos$ = this.productosService.getProductos$();    
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
    }   
  
    if (boton == "Añadir"){
      this.cargar();
         
    }
    if (boton == "Finalizar venta") {      
      this.finalizarVenta();
    }
    if (boton == "Nueva venta") {      
      this.nuevaVenta();
    }
  }

  nuevoProducto() {
    this.ventaActual = new Venta();
    this.mostrarNuevo = true;
    this.activarBoton("Nueva venta");
  }

  totalVenta(): number {
    let suma = 0;
    this.ventas.forEach(venta => {
      let cantidad = venta.precio * venta.cantidad;
      cantidad = Math.round(cantidad * 100) / 100;
      suma = Math.round((suma + cantidad) * 100) / 100;
    });
    return suma;
  }

  eliminarVenta(venta: Venta) {
    this.ventas.splice(this.ventas.indexOf(venta),1);
    this.total = this.totalVenta();

  }

  cargar() {
    console.log(this.ventaActual.producto);
    if (this.ventaActual.cantidad <= 0 || this.ventaActual.producto== null) {
      alert("La cantidad debe ser mayor que 0 y hay que seleccionar un producto");
    } else {    
      this.ventaActual.precio = this.ventaActual.producto.precio;    
      this.ventas.push(this.ventaActual);
      this.mostrarNuevo = false;
      this.total = this.totalVenta();      
      this.activarBoton("Finalizar venta");
      this.activarBoton("Añadir producto");
      this.desactivarBoton("Añadir");
    }
    
  }

  finalizarVenta(): void {
    this.cajaService.guardarVenta(this.ventas, this.tarjeta).subscribe(cod => this.codigoVenta = cod);
    this.mostrarNuevo = false; 
    this.desactivarBoton("Finalizar venta");
    this.desactivarBoton("Añadir");
    console.log("Desde finalizar venta",this.codigoVenta);

  }

  reiniciar() {
    this.ventas = [];
    this.mostrarNuevo= false; 
    this.total =0;
    this.codigoVenta = 0;
    this.activarBoton("Nueva venta");
    this.desactivarBoton("Finalizar venta");
    this.activarBoton("Añadir producto");
    this.desactivarBoton("Añadir");

  }

  nuevaVenta(): void {
    if (this.codigoVenta == 0 && this.ventas.length > 0) {
      var statusConfirm = confirm("¿Desea crear una nueva venta? La venta actual no se ha guardado");
      if (statusConfirm) this.reiniciar();
    } else {
      this.reiniciar();
    }
  }

  // envento enviado por router-outlet al activar la pagina
 /* onActivate(elementRef) {
    this.ngOnInit();
  }*/

}