import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Product } from '../product';
import { ProductsService } from '../products.service';
import { Observable, Subscription } from 'rxjs';
import { TYPES } from '../products-types';
import { toolsService } from 'src/app/tools/tools.service';
import { ButtonType } from 'src/app/tools/button-type';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

/*function productValidator(control: FormControl): {[s: string]: boolean} {
  if(this.productsService.getProductPorname(control.value) != undefined) {
    return {nameRepetido: true};
  }
}*/

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  @Output() productGuardado = new EventEmitter<Product>();

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

  constructor(private productsService: ProductsService, private toolsServices: toolsService, 
    formBuilder: FormBuilder) {
    this.formulario = formBuilder.group({
      'name': ['', Validators.required],
      'type': ['', Validators.required],
      'price': ['', Validators.compose([Validators.required, Validators.min(0.01)])]

    });

  }

  public types = TYPES;
  products$: Observable<Product[]>;
  product: Product;
  productRepetido: string = "";
  enviado: boolean = false;
  botones$: Observable<ButtonType[]>;
  _pulsadoSub: Subscription;

  boton: ButtonType = { id: "GuardarNew", name: "Guardar new", show: true };

  ngOnInit() {
    this.product = new Product();
    this.products$ = this.productsService.getProducts$();
    this.toolsServices.newButtonType(this.boton);
    this._pulsadoSub = this.toolsServices.getPulsado$().subscribe(boton => {
      if (boton == "GuardarNew") {
        this.onSubmit(this.formulario.value);
      }
    });
  }

  darFormato() {
    this.product.name = this.product.name.toLowerCase();
    this.product.name = this.product.name[0].toUpperCase() + this.product.name.slice(1);
  }

  // JSON.parse (JSON.stringif para pasar el objeto por referencia
  guardarProduct() {    
    //this.productsService.postNewProduct(JSON.parse(JSON.stringify(this.product)));
    this.productsService.postNewProduct(this.product).subscribe(respuesta => console.log("Se ha guardado el product", respuesta));
    this.enviado = true;
    this.toolsServices.eliminarButtonType(this.boton);
    console.log("DESDE NEW COMPONENT GUARDAR PRODUCT se ha guardado", this.product.name);
    this.product = new Product();
    this.productGuardado.emit(this.product)
  }

  procesarKeypress(key: KeyboardEvent, campo: HTMLElement) {
    if (key.keyCode == 13) { // press Enter      
      if (this.pasarASummit.nativeElement == campo) {
        console.log("DESDE NEW COMPONENT Se va a enviar el foco a button-list", this.boton.id);
        this.toolsServices.activarFoco(this.boton.id);
      } else {
        campo.focus();
      }
    }
  }

  onSubmit(value: any) {
    console.log("Lo devuelto por el formulario", value);
    this.productRepetido = "";
    
    if (this.formulario.valid) {
      if(this.productsService.getProductPorname(value.name) != undefined) {
        this.productRepetido = value.name;
        this.botonname.nativeElement.focus();
      } else {
        this.product.name = value.name;
        this.product.type = value.type;
        this.product.price = value.price;
        this.guardarProduct();
      }
    } else if(value.name != "" && this.productsService.getProductPorname(value.name) != undefined) {
      this.productRepetido = value.name;
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
    this.toolsServices.eliminarButtonType(this.boton);
  }


}


