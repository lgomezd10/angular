import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { ProductosService } from 'src/app/producto/productos.service';
import { Compra } from '../purchases';
import { Observable, BehaviorSubject } from 'rxjs';
import { Producto } from 'src/app/producto/producto';
import { purchasesService } from '../purchases.service';
import { Boton } from 'src/app/tools/boton';
import { toolsService } from 'src/app/tools/tools.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const nameBotones = { enviarCompra: 'EnviarCompra', crearProducto: 'CrearProducto', addProducto: 'AddProducto', add: 'Add' };

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  @ViewChild('buscar', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
    }
  }
  @ViewChild('enviar', { static: false }) pasarASummit: ElementRef;
  @ViewChild('elementoForm') elementoForm: ElementRef;

  formulario: FormGroup;
  purchases: Compra[] = [];
  compraActual: Compra;
  searchText: string;
  productos$: Observable<Producto[]>;
  mostrarNuevo: boolean = false;
  mostrarNuevoProducto: boolean = false;
  //total: number = 0;
  compraFinalizada: boolean = false;
  myDateValue: Date = new Date();
  botones: Boton[] = [
    { id: nameBotones.enviarCompra, name: "Enviar compra", mostrar: false },
    { id: nameBotones.crearProducto, name: "Crear producto", mostrar: true },
    { id: nameBotones.addProducto, name: "Añadir producto", mostrar: true },
    { id: nameBotones.add, name: "Añadir", mostrar: false }
  ];

  constructor(private productosService: ProductosService, private purchasesService: purchasesService,
    private toolsServices: toolsService, formBuilder: FormBuilder) {
    this.formulario = formBuilder.group({
      'buscar': [''],
      'producto': [null, Validators.required],
      'quantity': ['', Validators.compose([Validators.required, Validators.min(0.01)])],
      'price': ['', Validators.compose([Validators.required, Validators.min(0.01)])]

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
    if (boton == nameBotones.addProducto) {
      this.mostrarNuevoProducto = false;
      this.nuevoProducto();
      this.desactivarBoton(boton);
      this.activarBoton(nameBotones.add);
      this.activarBoton(nameBotones.crearProducto);
      //console.log("DESDE purchases COMPONENT este es el hijo autofoco", this.autoFoco);
      //setTimeout(() => this.autoFoco.nativeElement.focus(), 100);
      //this.autoFoco.nativeElement.focus();
    }
    if (boton == nameBotones.crearProducto) {
      this.desactivarBoton(boton);
      this.activarBoton(nameBotones.addProducto);
      this.desactivarBoton(nameBotones.add);
      this.mostrarNuevoProducto = true;
      this.mostrarNuevo = false;
    }
    if (boton == nameBotones.add) {
      this.onSubmit();
    }
    if (boton == nameBotones.enviarCompra) {
      this.enviarCompra();
    }
  }

  cargar() {
    let compra = this.purchases.find(compra => compra.producto.name == this.compraActual.producto.name);

    if (compra == undefined || compra.price != this.compraActual.price) {
      this.purchases.push(this.compraActual);
    } else {
      compra.quantity = compra.quantity + this.compraActual.quantity;
    }
    //this.total = this.totalCompra();
    this.mostrarNuevo = false;
    this.activarBoton(nameBotones.addProducto);
    this.desactivarBoton(nameBotones.add);
    this.activarBoton(nameBotones.enviarCompra);
    this.toolsServices.activarFoco(nameBotones.addProducto);

  }

  onSubmit() {
    if (this.formulario.valid) {
      this.compraActual.producto = this.formulario.value.producto;
      this.compraActual.quantity = this.formulario.value.quantity;
      this.compraActual.price = this.formulario.value.price;
      this.cargar();
    } else {
      this.formulario.markAllAsTouched();
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
    console.log("DESDE purchases COMPONET: Recibido evento de nuevoGuardado");
    this.activarBoton(nameBotones.addProducto);
    this.activarBoton(nameBotones.crearProducto);
    this.toolsServices.activarFoco(nameBotones.addProducto);
  }

  totalCompra(): number {
    let suma = 0;
    this.purchases.forEach(compra => {
      let quantity = compra.price * compra.quantity;
      quantity = Math.round(quantity * 100) / 100;
      suma = Math.round((suma + quantity) * 100) / 100;
    });
    return suma;
  }

  eliminarCompra(compra: Compra) {
    this.purchases.splice(this.purchases.indexOf(compra), 1);
    //this.total = this.totalCompra();
  }

  enviarCompra() {
    console.log(this.myDateValue);
    if (this.purchases.length == 0)
      alert("No hay productos comprados");
    else {
      this.purchasesService.guardarCompra(this.purchases).subscribe(resp => this.compraFinalizada = true);
      this.desactivarBoton(nameBotones.addProducto);
      this.desactivarBoton(nameBotones.crearProducto);
      this.desactivarBoton(nameBotones.enviarCompra);
    }
  }  

  procesarKeypress(key: KeyboardEvent, campo: HTMLElement) {
    if (key.keyCode == 13) { // press Enter      
      if (this.pasarASummit.nativeElement == campo) {
        this.toolsServices.activarFoco(nameBotones.add);
      } else {
        campo.focus();
      }

    }
  }

  onChange(e, campo) {
    campo.focus();
  }

}
