import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Venta } from '../venta';
import { Producto } from 'src/app/producto/producto';
import { Observable } from 'rxjs';
import { ProductosService } from 'src/app/producto/productos.service';
import { CajaService } from '../caja.service';
import { Boton } from 'src/app/herramientas/boton';
import { HerramientasService } from 'src/app/herramientas/herramientas.service';

const nombreBotones = {nuevaVenta:'NuevaVenta', finalizarVenta:'FinalizarVenta', addProducto:'AddProducto', add:'Add', reabrirTicket:'ReabrirTicket'};

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.scss']
})


export class CajaComponent implements OnInit {

  @ViewChild('buscar', { static: false }) set content(content: ElementRef) {
    if(content) {
      content.nativeElement.focus();
    }
  }
  @ViewChild('enviar', { static: false }) pasarASummit: ElementRef;

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
    {id:nombreBotones.nuevaVenta, nombre:"Nueva venta", mostrar:false},
    {id:nombreBotones.finalizarVenta, nombre:"Finalizar venta", mostrar:false},
    {id:nombreBotones.addProducto, nombre:"Añadir producto", mostrar: true},
    {id:nombreBotones.add, nombre:"Añadir", mostrar:false},
    {id:nombreBotones.reabrirTicket, nombre:"Reabrir ticket", mostrar:false}
  ];

  constructor(private productosService: ProductosService, private cajaService: CajaService, private herramientasService: HerramientasService) { }


  ngOnInit() {
    this.productos$ = this.productosService.getProductos$();  
  }

  activarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = true;
  }

  desactivarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = false;
  }

  mostrarBoton(boton: string) {
    console.log("DESDE CAJA COMPONENT se activa el boton", boton);
    if (boton == nombreBotones.addProducto) {
      this.nuevoProducto();
      this.searchText = "";
      this.desactivarBoton(boton);
      this.activarBoton(nombreBotones.add);
    }   
  
    if (boton == nombreBotones.add){
      this.cargar();
         
    }
    if (boton == nombreBotones.finalizarVenta) {    
      this.finalizarVenta();
    }
    if (boton == nombreBotones.nuevaVenta) {      
      this.nuevaVenta();
    }
    if (boton == nombreBotones.reabrirTicket) {
      this.abierta = true;
      this.activarBoton(nombreBotones.addProducto);
      this.desactivarBoton(nombreBotones.reabrirTicket);
      this.activarBoton(nombreBotones.finalizarVenta);
    }
  }

  nuevoProducto() {
    this.ventaActual = new Venta();
    this.mostrarNuevo = true;
    this.activarBoton(nombreBotones.nuevaVenta);
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
    if (this.ventaActual.cantidad <= 0 || this.ventaActual.producto == null) {
      alert("La cantidad debe ser mayor que 0 y hay que seleccionar un producto");
    } else {
      let venta = this.ventas.find(venta => venta.producto.nombre == this.ventaActual.producto.nombre);

      if (venta == undefined) {
        this.ventaActual.precio = this.ventaActual.producto.precio;
        this.ventas.push(this.ventaActual);        
      } else {
        venta.cantidad = this.ventaActual.cantidad + venta.cantidad;
      }
      this.mostrarNuevo = false;
        this.total = this.totalVenta();
        this.activarBoton(nombreBotones.finalizarVenta);
        this.activarBoton(nombreBotones.addProducto);
        this.desactivarBoton(nombreBotones.add);
        this.herramientasService.activarFoco(nombreBotones.addProducto);
    }
    
  }

  finalizarVenta(): void {
    if (this.codigoVenta == 0)
      this.cajaService.guardarVenta(this.ventas, this.tarjeta).subscribe(cod => this.codigoVenta = cod);
    else 
      this.cajaService.actualizarVenta(this.codigoVenta, this.ventas, this.tarjeta).subscribe(cod => this.codigoVenta = cod);      
    this.mostrarNuevo = false; 
    this.abierta = false;
    this.desactivarBoton(nombreBotones.finalizarVenta);
    this.desactivarBoton(nombreBotones.add);
    this.desactivarBoton(nombreBotones.addProducto);
    this.activarBoton(nombreBotones.reabrirTicket);
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
    this.activarBoton(nombreBotones.nuevaVenta);
    this.desactivarBoton(nombreBotones.finalizarVenta);
    this.activarBoton(nombreBotones.addProducto);
    this.desactivarBoton(nombreBotones.add);

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

  procesarKeypress(key: KeyboardEvent, campo: HTMLElement) {
    if(key.keyCode == 13) { // press Enter      
      if (this.pasarASummit.nativeElement == campo) {
        console.log("DESDE CAJA COMPONENTE TS: Se va a enviar el foco a lista-botones", "Add");
        this.herramientasService.activarFoco("Add");
      } else {
        console.log("El atributo de campo es", campo.getAttributeNames());
        campo.focus();
       // let cosa: HTMLInputElement = campo;
       // cosa.select
      }
    }
  }

  
  onChange(e,campo) {
    campo.focus();
  }

}
