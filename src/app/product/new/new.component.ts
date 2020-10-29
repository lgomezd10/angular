import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, ViewChildren, QueryList, Input, AfterContentInit, AfterViewInit } from '@angular/core';
import { Product } from '../product';
import { ProductsService } from '../products.service';
import { Observable, Subscription } from 'rxjs';
import { TYPES } from '../products-types';
import { ToolsService } from 'src/app/tools/tools.service';
import { ButtonType } from 'src/app/tools/button-type';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormErrors } from '@app/tools/form-errors';

/*function productValidator(control: FormControl): {[s: string]: boolean} {
  if(this.productsService.getProductByName(control.value) != undefined) {
    return {nameRepetido: true};
  }
}*/

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  @Input() isModal: boolean = false;
  @Output() savedProduct = new EventEmitter<Product>();

  buttonName: ElementRef;

  // set focus when init the component
  @ViewChild('name', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
      this.buttonName = content;
    }
  }
  @ViewChild('sent', { static: false }) goToSummit: ElementRef;

  @ViewChild('sentButton', { static: false }) sentButton: ElementRef;

  @ViewChild('elementForm') elementForm: ElementRef;

  formGroup: FormGroup;

  public types = TYPES;
  products$: Observable<Product[]>;
  product: Product;
  repeatedProduct: string = "";
  sent: boolean = false;
  buttons: Observable<ButtonType[]>;
  _pressSub: Subscription;

  boton: ButtonType = { id: "SaveNew", name: "Guardar nuevo", show: true };
  botones: ButtonType[] = [this.boton];

  

  constructor(private productsService: ProductsService, private toolsServices: ToolsService,
    formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      'name': ['', Validators.required],
      'type': ['', Validators.required],
      'price': ['', Validators.compose([Validators.required, Validators.min(0.01)])]

    });

  }
 
  ngOnInit() {
    
    this.product = new Product();
    this.products$ = this.productsService.getProducts$();
    console.log("Es modal?", this.isModal);
    if (this.isModal) {
      
    } else {
      this.toolsServices.newButtonType(this.boton);
      this._pressSub = this.toolsServices.getPulsado$().subscribe(boton => {
        if (boton == "SaveNew") {
          this.onSubmit();
        }
      });
    }
  }

  format() {
    this.product.name = this.product.name.toLowerCase();
    this.product.name = this.product.name[0].toUpperCase() + this.product.name.slice(1);
  }

  // JSON.parse (JSON.stringif para pasar el objeto por referencia
  saveProduct() {
    //this.productsService.postNewProduct(JSON.parse(JSON.stringify(this.product)));
    this.productsService.postNewProduct(this.product).subscribe(respuesta => {
      this.sent=true;
      if (!this.isModal) this.toolsServices.deleteButtonType(this.boton);
      this.product = new Product();
      this.savedProduct.emit(this.product)
    });
    
    
  }

  keyPress(key: KeyboardEvent, campo: HTMLElement) {
    if (key.keyCode == 13) { // press Enter      
      
      if (this.goToSummit.nativeElement == campo) {
        if(this.isModal) this.sentButton.nativeElement.focus();
        else this.toolsServices.activateFocus(this.boton.id);
      } else {
        campo.focus();
      }
    }
  }

  onSubmit() {
    let value = this.formGroup.value;
    console.log("Lo devuelto por el formGroup", value);
    this.repeatedProduct = "";

    if (this.formGroup.valid) {
      if (this.productsService.getProductByName(value.name) != undefined) {
        this.repeatedProduct = value.name;
        this.buttonName.nativeElement.focus();
      } else {
        this.product.name = value.name;
        this.product.type = value.type;
        this.product.price = value.price;
        this.saveProduct();
      }
    } else if (value.name != "" && this.productsService.getProductByName(value.name) != undefined) {
      this.repeatedProduct = value.name;
      this.buttonName.nativeElement.focus();
    } else {
      //this.buttonName.nativeElement.focus();
      this.elementForm.nativeElement.querySelector('.ng-invalid').focus();
    }
  }

  onChange(e, campo) {
    campo.focus();
  }

  checkError(field: string): boolean {
    return FormErrors.checkError(field, this.formGroup)
  }

  getError(name: string, field: string): string {
    return FormErrors.getError(name, field, this.formGroup);
  }


  ngOnDestroy() {
    if (this._pressSub) this._pressSub.unsubscribe();
    if(!this.isModal) this.toolsServices.deleteButtonType(this.boton);
  }


}


