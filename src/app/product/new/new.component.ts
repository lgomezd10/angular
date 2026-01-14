import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { Product } from '../product';
import { ProductsService } from '../products.service';
import { Observable } from 'rxjs';
import { TYPES } from '../products-types';
import { ToolsService } from 'src/app/tools/tools.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrors } from '@app/tools/form-errors';
import { AsyncPipe } from '@angular/common';
import { SortPipe } from '../sort.pipe';
import { FilterPipe } from '../filter.pipe';
import { RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber'
import { Button, ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, SortPipe, ButtonModule,
    FilterPipe, RouterModule, SelectModule, InputNumberModule, InputTextModule, MessageModule, DialogModule]
})
export class NewComponent implements OnInit {


  @Input() display: boolean = true;
  @Output() savedProduct = new EventEmitter<string>();

  formGroup: UntypedFormGroup;

  public types = TYPES;
  products$: Observable<Product[]>;
  product: Product;
  repeatedProduct: string = "";

  

  constructor(private productsService: ProductsService, private toolsServices: ToolsService,
    formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      'name': ['', Validators.required],
      'type': ['', Validators.required],
      'price': ['', Validators.compose([Validators.required, Validators.min(0.01)])]

    });

  }
 
  ngOnInit() {
    
    this.product = new Product();
    this.products$ = this.productsService.getProducts$();
  }

  onDialogHide() {
    // Resetea el formulario o notifica al padre si es necesario
    this.display = false;
    this.savedProduct.emit('closed');

  }

  format() {
    this.product.name = this.product.name.toLowerCase();
    this.product.name = this.product.name[0].toUpperCase() + this.product.name.slice(1);
  }

  saveProduct() {
    this.productsService.postNewProduct(this.product).subscribe(response => {
      this.product = new Product();
      this.resetForm();
      this.savedProduct.emit('saved');
    });
  }

  resetForm() {
    this.formGroup.reset();
    this.repeatedProduct = "";
  }

  keyPress(key: KeyboardEvent, campo: HTMLElement | Button) {
    if (key.code == "Enter") {
      if (campo instanceof Button) {
        campo.el.nativeElement.click();
      } else
        campo.focus();
    }
  }

  onSubmit() {
    let value = this.formGroup.value;
    this.repeatedProduct = "";

    if (this.formGroup.valid) {
      if (this.productsService.getProductByName(value.name) == undefined) {
        console.log('Creating product with values:', value);
        this.product.name = value.name;
        this.product.type = value.type;
        this.product.price = value.price;        
        this.saveProduct();        
      } else {
        console.log('Product name already exists:', value.name);
        this.repeatedProduct = value.name;
      }
    } else if (value.name != "" && this.productsService.getProductByName(value.name) != undefined) {
      console.log('Product name already exists:', value.name);
      this.repeatedProduct = value.name;
    }
  }

  onChange(e, campo) {
    campo.focus();
  }

  isFieldValid(field: string): boolean {
    return FormErrors.checkError(field, this.formGroup)
  }

  getError(name: string, field: string): string {
    return FormErrors.getError(name, field, this.formGroup);
  }
}
