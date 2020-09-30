import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Producto } from '../product';
import { ProductosService } from '../products.service';
import { Observable, Subscription } from 'rxjs';
import { TYPES } from '../products-types';
import { toolsService } from 'src/app/tools/tools.service';
import { Boton } from 'src/app/tools/boton';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

/*function productoValidator(control: FormControl): {[s: string]: boolean} {
  if(this.productosService.getProductoPorname(control.value) != undefined) {
    return {nameRepetido: true};
  }
}*/

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  @Output() productoGuardado = new EventEmitter<Producto>();

  botonname: ElementRef;

  @ViewChild('name', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
      this.botonname = content;
    }
  }
  @ViewChild('enviar', { static: false }) pasarASummit: ElementRef;

  @ViewChild('elementoForm') elementoForm: ElementRef;

  formulario: FormGroup;

  constructor(private productosService: ProductosService, private toolsServices: toolsService, 
    formBuilder: FormBuilder) {
    this.formulario = formBuilder.group({
      'name': ['', Validators.required],
      'type': ['', Validators.required],
      'price': ['', Validators.compose([Validators.required, Validators.min(0.01)])]

    });

  }

  public types = TYPES;
  productos$: Observable<Producto[]>;
  producto: Producto;
  productoRepetido: string = "";
  enviado: boolean = false;
  botones$: Observable<Boton[]>;
  _pulsadoSub: Subscription;

  boton: Boton = { id: "GuardarNuevo", name: "Guardar nuevo", mostrar: true };

  ngOnInit() {
    this.producto = new Producto();
    this.productos$ = this.productosService.getProductos$();
    this.toolsServices.nuevoBoton(this.boton);
    this._pulsadoSub = this.toolsServices.getPulsado$().subscribe(boton => {
      if (boton == "GuardarNuevo") {
        this.onSubmit(this.formulario.value);
      }
    });
  }

  darFormato() {
    this.producto.name = this.producto.name.toLowerCase();
    this.producto.name = this.producto.name[0].toUpperCase() + this.producto.name.slice(1);
  }

  // JSON.parse (JSON.stringif para pasar el objeto por referencia
  guardarProducto() {    
    //this.productosService.postNuevoProducto(JSON.parse(JSON.stringify(this.producto)));
    this.productosService.postNuevoProducto(this.producto).subscribe(respuesta => console.log("Se ha guardado el producto", respuesta));
    this.enviado = true;
    this.toolsServices.eliminarBoton(this.boton);
    console.log("DESDE NUEVO COMPONENT GUARDAR PRODUCTO se ha guardado", this.producto.name);
    this.producto = new Producto();
    this.productoGuardado.emit(this.producto)
  }

  procesarKeypress(key: KeyboardEvent, campo: HTMLElement) {
    if (key.keyCode == 13) { // press Enter      
      if (this.pasarASummit.nativeElement == campo) {
        console.log("DESDE NUEVO COMPONENT Se va a enviar el foco a lista-botones", this.boton.id);
        this.toolsServices.activarFoco(this.boton.id);
      } else {
        campo.focus();
      }
    }
  }

  onSubmit(value: any) {
    console.log("Lo devuelto por el formulario", value);
    this.productoRepetido = "";
    
    if (this.formulario.valid) {
      if(this.productosService.getProductoPorname(value.name) != undefined) {
        this.productoRepetido = value.name;
        this.botonname.nativeElement.focus();
      } else {
        this.producto.name = value.name;
        this.producto.type = value.type;
        this.producto.price = value.price;
        this.guardarProducto();
      }
    } else if(value.name != "" && this.productosService.getProductoPorname(value.name) != undefined) {
      this.productoRepetido = value.name;
      this.botonname.nativeElement.focus();
    } else {
      //this.botonname.nativeElement.focus();
      this.elementoForm.nativeElement.querySelector('.ng-invalid').focus();
    }
  }

  onChange(e, campo) {
    campo.focus();
  }

  ngOnDestroy() {
    if (this._pulsadoSub) this._pulsadoSub.unsubscribe();
    this.toolsServices.eliminarBoton(this.boton);
  }


}


