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
  abierta: boolean = false;
  buscarVenta: number = 0;
  ventaActual: Venta;
  searchText: string;
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
    {nombre:"Añadir", mostrar:false},
    {nombre:"Reabrir ticket", mostrar:false}
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
      this.searchText = "";
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
    if (boton == "Reabrir ticket") {
      this.abierta = true;
      this.activarBoton("Añadir producto");
      this.desactivarBoton("Reabrir ticket");
      this.activarBoton("Finalizar venta");
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
    if (this.codigoVenta == 0)
      this.cajaService.guardarVenta(this.ventas, this.tarjeta).subscribe(cod => this.codigoVenta = cod);
    else 
      this.cajaService.actualizarVenta(this.codigoVenta, this.ventas, this.tarjeta).subscribe(cod => this.codigoVenta = cod);      
    this.mostrarNuevo = false; 
    this.abierta = false;
    this.desactivarBoton("Finalizar venta");
    this.desactivarBoton("Añadir");
    this.desactivarBoton("Añadir producto");
    this.activarBoton("Reabrir ticket");
    console.log("Desde finalizar venta",this.codigoVenta);

  }

  abrirVenta(id_ventas: number) {    
    this.cajaService.obtenerVenta(id_ventas).subscribe(ventas => {
      console.log("elementos recibidos", ventas.elementos);
      this.ventas = [];
      this.ventas = this.cajaService.ventasAListaVenta(ventas);
      this.codigoVenta = ventas.id_ventas;
      this.tarjeta = ventas.tarjeta;      
      this.total = this.totalVenta();
      this.abierta = true;
    });     
    console.log("lo guardado en ventas", this.ventas);
    
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
