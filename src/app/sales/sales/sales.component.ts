import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Sale } from '../sale';
import { Producto } from 'src/app/producto/producto';
import { Observable } from 'rxjs';
import { ProductosService } from 'src/app/producto/productos.service';
import { SalesService } from '../sales.service';
import { Boton } from 'src/app/tools/boton';
import { toolsService } from 'src/app/tools/tools.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const nameBotones = { nuevaSale: 'NuevaSale', finalizarSale: 'FinalizarSale', addProducto: 'AddProducto', add: 'Add', reabrirTicket: 'ReabrirTicket' };

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})


export class SalesComponent implements OnInit {

  @ViewChild('buscar', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
    }
  }
  @ViewChild('enviar', { static: false }) pasarASummit: ElementRef;

  @ViewChild('elementoForm') elementoForm: ElementRef;

  formulario: FormGroup;
  ventas: Sale[] = [];
  abierta: boolean = false;
  buscarSale: number = 0;
  ventaActual: Sale;
  searchText: string;
  mostrarNuevo: boolean = false;
  productos$: Observable<Producto[]>;
  seleccionado: Producto;
  //total: number=0;
  codigoSale: number = 0;
  tarjeta: boolean = false;

  botones: Boton[] = [
    { id: nameBotones.nuevaSale, name: "Nueva venta", mostrar: false },
    { id: nameBotones.finalizarSale, name: "Finalizar venta", mostrar: false },
    { id: nameBotones.addProducto, name: "Añadir producto", mostrar: true },
    { id: nameBotones.add, name: "Añadir", mostrar: false },
    { id: nameBotones.reabrirTicket, name: "Reabrir ticket", mostrar: false }
  ];

  constructor(private productosService: ProductosService, private salesService: SalesService,
    private toolsService: toolsService, formBuilder: FormBuilder) {
    this.formulario = formBuilder.group({
      'buscar': [''],
      'producto': [null, Validators.required],
      'quantity': ['', Validators.compose([Validators.required, Validators.min(0.01)])]
    });
  }


  ngOnInit() {
    this.productos$ = this.productosService.getProductos$();
  }

  activarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id }).mostrar = true;
  }

  desactivarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id }).mostrar = false;
  }

  mostrarBoton(boton: string) {
    console.log("DESDE sales COMPONENT se activa el boton", boton);
    if (boton == nameBotones.addProducto) {
      this.nuevoProducto();
      this.searchText = "";
      this.desactivarBoton(boton);
      this.activarBoton(nameBotones.add);
    }

    if (boton == nameBotones.add) {
      this.onSubmit();

    }
    if (boton == nameBotones.finalizarSale) {
      this.finalizarSale();
    }
    if (boton == nameBotones.nuevaSale) {
      this.nuevaSale();
    }
    if (boton == nameBotones.reabrirTicket) {
      this.abierta = true;
      this.activarBoton(nameBotones.addProducto);
      this.desactivarBoton(nameBotones.reabrirTicket);
      this.activarBoton(nameBotones.finalizarSale);
    }
  }

  nuevoProducto() {
    this.ventaActual = new Sale();
    this.formulario.reset();
    this.mostrarNuevo = true;
    this.activarBoton(nameBotones.nuevaSale);
  }

  totalSale(): number {
    let suma = 0;
    this.ventas.forEach(venta => {
      let quantity = venta.price * venta.quantity;
      quantity = Math.round(quantity * 100) / 100;
      suma = Math.round((suma + quantity) * 100) / 100;
    });
    return suma;
  }

  eliminarSale(venta: Sale) {
    this.ventas.splice(this.ventas.indexOf(venta), 1);
    //this.totalSale = this.totalSale();

  }

  cargar() {
    console.log(this.ventaActual.producto);

    let venta = this.ventas.find(venta => venta.producto.name == this.ventaActual.producto.name);

    if (venta == undefined) {
      this.ventaActual.price = this.ventaActual.producto.price;
      this.ventas.push(this.ventaActual);
    } else {
      venta.quantity = this.ventaActual.quantity + venta.quantity;
    }
    this.mostrarNuevo = false;
    //this.totalSale = this.totalSale();
    this.activarBoton(nameBotones.finalizarSale);
    this.activarBoton(nameBotones.addProducto);
    this.desactivarBoton(nameBotones.add);
    this.toolsService.activarFoco(nameBotones.addProducto);


  }

  onSubmit() {
    if (this.formulario.valid) {
      this.ventaActual.producto = this.formulario.value.producto;
      this.ventaActual.quantity = this.formulario.value.quantity;
      this.cargar();
    } else {
      this.elementoForm.nativeElement.querySelector('.ng-invalid').focus();
    }
  }

  finalizarSale(): void {
    if (this.codigoSale == 0)
      this.salesService.guardarSale(this.ventas, this.tarjeta).subscribe(cod => this.codigoSale = cod);
    else
      this.salesService.actualizarSale(this.codigoSale, this.ventas, this.tarjeta).subscribe(cod => this.codigoSale = cod);
    this.mostrarNuevo = false;
    this.abierta = false;
    this.desactivarBoton(nameBotones.finalizarSale);
    this.desactivarBoton(nameBotones.add);
    this.desactivarBoton(nameBotones.addProducto);
    this.activarBoton(nameBotones.reabrirTicket);
    console.log("Desde finalizar venta", this.codigoSale);

  }

  abrirSale(salesId: number) {
    this.salesService.obtenerSale(salesId).subscribe(ventas => {
      console.log("elementos recibidos", ventas.elementos);
      this.ventas = [];
      this.ventas = this.salesService.ventasAListaSale(ventas);
      this.codigoSale = ventas.salesId;
      this.tarjeta = ventas.tarjeta;
      //this.totalSale = this.totalSale();
      this.abierta = true;
    });
    console.log("lo guardado en ventas", this.ventas);

  }

  reiniciar() {
    this.ventas = [];
    this.mostrarNuevo = false;
    //this.totalSale =0;
    this.codigoSale = 0;
    this.activarBoton(nameBotones.nuevaSale);
    this.desactivarBoton(nameBotones.finalizarSale);
    this.activarBoton(nameBotones.addProducto);
    this.desactivarBoton(nameBotones.add);
    this.desactivarBoton(nameBotones.reabrirTicket);

  }

  nuevaSale(): void {
    if (this.codigoSale == 0 && this.ventas.length > 0) {
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
    if (key.keyCode == 13) { // press Enter      
      if (this.pasarASummit.nativeElement == campo) {
        console.log("DESDE sales COMPONENTE TS: Se va a enviar el foco a lista-botones", "Add");
        this.toolsService.activarFoco("Add");
      } else {
        console.log("El atributo de campo es", campo.getAttributeNames());
        campo.focus();
        // let cosa: HTMLInputElement = campo;
        // cosa.select
      }
    }
  }


  onChange(e, campo) {
    campo.focus();
  }

}
