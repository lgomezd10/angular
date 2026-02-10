import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { ActivatedRoute } from '@angular/router';
import { TYPES } from '../products-types';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ButtonType } from '../../tools/button-type';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormErrors } from '../../tools/form-errors';
import { ButtonListComponent } from '../../tools/button-list/button-list.component';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, ButtonListComponent, MessageModule, SelectModule, InputNumberModule, InputTextModule]
})
export class ProductComponent implements OnInit, OnDestroy {

  id: number = 0;
  product: Product = new Product();
  formGroup: UntypedFormGroup;
  repeatedProduct: string = "";
  private _docSub: Subscription = new Subscription();
  public types = TYPES;
  updatedProduct = {
    show: false,
    product: null as Product | null
  }
  buttons: ButtonType[] = [
    { id: "Save", name: "Guardar", show: true, focused: false },
    { id: "Return", name: "Volver", show: true, focused: false }
  ];

  buttonName: ElementRef | undefined;
  repitedProduct: any = "";

  // set focus when init the component
  @ViewChild('name', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
      this.buttonName = content;
    }
  }

  @ViewChild('elementForm') elementForm: ElementRef | undefined;

  constructor(private readonly productsService: ProductsService, private readonly route: ActivatedRoute, private readonly location: Location, formBuilder: UntypedFormBuilder) {

    this.formGroup = formBuilder.group({
      'id': [''],
      'name': ['', Validators.required],
      'price': ['', Validators.compose([Validators.required, Validators.min(0.01)])],
      'type': ['', Validators.required],
      'stock': ['']
    });


  }
  ngOnDestroy(): void {
    this._docSub.unsubscribe();
  }

  ngOnInit(): void {
    this.productsService.loadProducts();
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam;
        this._docSub = this.productsService.getProducts$().subscribe(products => {
          const product = this.productsService.getProduct(this.id);
          if (product) {
            this.product = product;
            this.loadProduct(this.product);
          }
        });
      }
    });
  }

  loadProduct(product: Product) {
    if (product) {
      this.formGroup.patchValue({
        id: product?.id,
        name: product?.name,
        price: product?.price,
        type: product?.type,
        stock: product?.stock
      });
    }
  }

  activateButtonType(id: string) {
    const button = this.buttons.find(button => { return button.id == id });
    if (button) {
      button.show = true;
    }
  }

  disableButtonType(id: string) {
    const button = this.buttons.find(button => { return button.id == id });
    if (button) {
      button.show = false;
    }
  }

  showButtonType(button: string) {
    if (button == "Return") {
      this.return();
    }
    if (button == "Save") {
      this.editProduct();
    }
  }

  editProduct() {
    const product = this.productsService.getProductByName(this.formGroup.controls['name'].value);
    if (product && product.id != this.id) {
      this.repeatedProduct = product.name;
      this.buttonName?.nativeElement.focus();
    }
    else if (this.formGroup.valid) {
      this.repeatedProduct = "";
      this.productsService.postEditProduct(this.formGroup.value).subscribe(response => {
        this.updatedProduct.show = true;
        this.updatedProduct.product = response;
        this.loadProduct(this.updatedProduct.product);
        setTimeout(() => { this.updatedProduct.show = false }, 5000);
      });

    } else {
      this.elementForm?.nativeElement.querySelector('.ng-invalid')?.focus();
    }
  }

  checkError(field: string): boolean {
    return FormErrors.checkError(field, this.formGroup)
  }

  getError(name: string, field: string): string {
    return FormErrors.getError(name, field, this.formGroup);
  }

  return() {
    this.location.back();
  }

}
