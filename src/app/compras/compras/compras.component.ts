import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { ProductosService } from 'src/app/producto/productos.service';
import { Compra } from '../compra';
import { Observable, BehaviorSubject } from 'rxjs';
import { Producto } from 'src/app/producto/producto';
import { ComprasService } from '../compras.service';
import { Boton } from 'src/app/herramientas/boton';
import { HerramientasService } from 'src/app/herramientas/herramientas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const nombreBotones = { enviarCompra: 'EnviarCompra', crearProducto: 'CrearProducto', addProducto: 'AddProducto', add: 'Add' };

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.scss']
})
export class ComprasComponent implements OnInit {

  @ViewChild('buscar', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
    }
  }
  @ViewChild('enviar', { static: false }) pasarASummit: ElementRef;
  @ViewChild('elementoForm') elementoForm: ElementRef;

  formulario: FormGroup;
  compras: Compra[] = [];
  compraActual: Compra;
  searchText: string;
  productos$: Observable<Producto[]>;
  mostrarNuevo: boolean = false;
  mostrarNuevoProducto: boolean = false;
  //total: number = 0;
  compraFinalizada: boolean = false;
  myDateValue: Date = new Date();
  botones: Boton[] = [
    { id: nombreBotones.enviarCompra, nombre: "Enviar compra", mostrar: false },
    { id: nombreBotones.crearProducto, nombre: "Crear producto", mostrar: true },
    { id: nombreBotones.addProducto, nombre: "Añadir producto", mostrar: true },
    { id: nombreBotones.add, nombre: "Añadir", mostrar: false }
  ];

  constructor(private productosService: ProductosService, private comprasService: ComprasService,
    private herramientasServices: HerramientasService, formBuilder: FormBuilder) {
    this.formulario = formBuilder.group({
      'buscar': [''],
      'producto': [null, Validators.required],
      'cantidad': ['', Validators.compose([Validators.required, Validators.min(0.01)])],
      'precio': ['', Validators.compose([Validators.required, Validators.min(0.01)])]

    });

  }

  ngOnInit() {
    this.productos$ = this.productosService.getProductos$();
  }

  cambiarBoton(id: string, mostrar: boolean) {
    this.botones.find(boton => { return boton.id == id }).mostrar = mostrar;

  }

  activarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id }).mostrar = true;
  }

  desactivarBoton(id: string) {
    this.botones.find(boton => { return boton.id == id }).mostrar = false;
  }


  mostrarBoton(boton: string) {
    if (boton == nombreBotones.addProducto) {
      this.mostrarNuevoProducto = false;
      this.nuevoProducto();
      this.desactivarBoton(boton);
      this.activarBoton(nombreBotones.add);
      this.activarBoton(nombreBotones.crearProducto);
      //console.log("DESDE COMPRAS COMPONENT este es el hijo autofoco", this.autoFoco);
      //setTimeout(() => this.autoFoco.nativeElement.focus(), 100);
      //this.autoFoco.nativeElement.focus();
    }
    if (boton == nombreBotones.crearProducto) {
      this.desactivarBoton(boton);
      this.activarBoton(nombreBotones.addProducto);
      this.desactivarBoton(nombreBotones.add);
      this.mostrarNuevoProducto = true;
      this.mostrarNuevo = false;
    }
    if (boton == nombreBotones.add) {
      this.onSubmit();
    }
    if (boton == nombreBotones.enviarCompra) {
      this.enviarCompra();
    }
  }

  cargar() {

    let compra = this.compras.find(compra => compra.producto.nombre == this.compraActual.producto.nombre);

    if (compra == undefined || compra.precio != this.compraActual.precio) {
      this.compras.push(this.compraActual);
    } else {
      compra.cantidad = compra.cantidad + this.compraActual.cantidad;
    }
    //this.total = this.totalCompra();
    this.mostrarNuevo = false;
    this.activarBoton(nombreBotones.addProducto);
    this.desactivarBoton(nombreBotones.add);
    this.activarBoton(nombreBotones.enviarCompra);
    this.herramientasServices.activarFoco(nombreBotones.addProducto);

  }

  onSubmit() {
    if (this.formulario.valid) {
      this.compraActual.producto = this.formulario.value.producto;
      this.compraActual.cantidad = this.formulario.value.cantidad;
      this.compraActual.precio = this.formulario.value.precio;
      this.cargar();
    } else {
      this.elementoForm.nativeElement.querySelector('.ng-invalid').focus();
    }
  }

  nuevoProducto() {
    this.compraActual = new Compra();
    this.formulario.reset();
    this.mostrarNuevo = true;
    this.searchText = "";
  }

  nuevoGuardado(producto: Producto) {
    console.log("DESDE Compras COMPONET: Recibido evento de nuevoGuardado");
    this.activarBoton(nombreBotones.addProducto);
    this.activarBoton(nombreBotones.crearProducto);
    this.herramientasServices.activarFoco(nombreBotones.addProducto);
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
    //this.total = this.totalCompra();
  }

  enviarCompra() {
    console.log(this.myDateValue);
    if (this.compras.length == 0)
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

  procesarKeypress(key: KeyboardEvent, campo: HTMLElement) {
    if (key.keyCode == 13) { // press Enter      
      if (this.pasarASummit.nativeElement == campo) {
        console.log("Se va a enviar el foco a lista-botones", "Añadir");
        this.herramientasServices.activarFoco(nombreBotones.add);
      } else {
        campo.focus();
      }

    }
  }

  onChange(e, campo) {
    campo.focus();
  }

}
