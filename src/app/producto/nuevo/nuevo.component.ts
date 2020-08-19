import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Producto } from '../producto';
import { ProductosService } from '../productos.service';
import { Observable, Subscription } from 'rxjs';
import { TIPOS } from '../tipos-productos';
import { HerramientasService } from 'src/app/herramientas/herramientas.service';
import { Boton } from 'src/app/herramientas/boton';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

/*function productoValidator(control: FormControl): {[s: string]: boolean} {
  if(this.productosService.getProductoPorNombre(control.value) != undefined) {
    return {nombreRepetido: true};
  }
}*/

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  @Output() productoGuardado = new EventEmitter<Producto>();

  botonNombre: ElementRef;

  @ViewChild('nombre', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
      this.botonNombre = content;
    }
  }
  @ViewChild('enviar', { static: false }) pasarASummit: ElementRef;

  @ViewChild('elementoForm') elementoForm: ElementRef;

  formulario: FormGroup;

  constructor(private productosService: ProductosService, private herramientasServices: HerramientasService, 
    formBuilder: FormBuilder) {
    this.formulario = formBuilder.group({
      'nombre': ['', Validators.required],
      'tipo': ['', Validators.required],
      'precio': ['', Validators.compose([Validators.required, Validators.min(0.01)])]

    });

  }

  public tipos = TIPOS;
  productos$: Observable<Producto[]>;
  producto: Producto;
  productoRepetido: string = "";
  enviado: boolean = false;
  botones$: Observable<Boton[]>;
  _pulsadoSub: Subscription;

  boton: Boton = { id: "GuardarNuevo", nombre: "Guardar nuevo", mostrar: true };

  ngOnInit() {
    this.producto = new Producto();
    this.productos$ = this.productosService.getProductos$();
    this.herramientasServices.nuevoBoton(this.boton);
    this._pulsadoSub = this.herramientasServices.getPulsado$().subscribe(boton => {
      if (boton == "GuardarNuevo") {
        this.onSubmit(this.formulario.value);
      }
    });
  }

  darFormato() {
    this.producto.nombre = this.producto.nombre.toLowerCase();
    this.producto.nombre = this.producto.nombre[0].toUpperCase() + this.producto.nombre.slice(1);
  }

  // JSON.parse (JSON.stringif para pasar el objeto por referencia
  guardarProducto() {    
    //this.productosService.postNuevoProducto(JSON.parse(JSON.stringify(this.producto)));
    this.productosService.postNuevoProducto(this.producto);
    this.enviado = true;
    this.herramientasServices.eliminarBoton(this.boton);
    console.log("DESDE NUEVO COMPONENT GUARDAR PRODUCTO se ha guardado", this.producto.nombre);
    this.producto = new Producto();
    this.productoGuardado.emit(this.producto)
  }

  procesarKeypress(key: KeyboardEvent, campo: HTMLElement) {
    if (key.keyCode == 13) { // press Enter      
      if (this.pasarASummit.nativeElement == campo) {
        console.log("DESDE NUEVO COMPONENT Se va a enviar el foco a lista-botones", this.boton.id);
        this.herramientasServices.activarFoco(this.boton.id);
      } else {
        campo.focus();
      }
    }
  }

  onSubmit(value: any) {
    console.log("Lo devuelto por el formulario", value);
    this.productoRepetido = "";
    
    if (this.formulario.valid) {
      if(this.productosService.getProductoPorNombre(value.nombre) != undefined) {
        this.productoRepetido = value.nombre;
        this.botonNombre.nativeElement.focus();
      } else {
        this.producto.nombre = value.nombre;
        this.producto.tipo = value.tipo;
        this.producto.precio = value.precio;
        this.guardarProducto();
      }
    } else if(value.nombre != "" && this.productosService.getProductoPorNombre(value.nombre) != undefined) {
      this.productoRepetido = value.nombre;
      this.botonNombre.nativeElement.focus();
    } else {
      //this.botonNombre.nativeElement.focus();
      this.elementoForm.nativeElement.querySelector('.ng-invalid').focus();
    }
  }

  onChange(e, campo) {
    campo.focus();
  }

  ngOnDestroy() {
    if (this._pulsadoSub) this._pulsadoSub.unsubscribe();
    this.herramientasServices.eliminarBoton(this.boton);
  }


}


