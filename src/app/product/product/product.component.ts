import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { ActivatedRoute } from '@angular/router';
import { TYPES } from '../products-types';
import { Location } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ButtonType } from 'src/app/tools/button-type';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '@app/tools/form-errors';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {

  //private products$: Observable<Product[]>;
  id: number;
  product: Product;
  formGroup: FormGroup;
  repeatedProduct: string = "";
  private _docSub: Subscription;
  public types = TYPES;
  updatedProduct = {
    show: false,
    product: null
  }
  buttons: ButtonType[] = [
    { id: "Save", name: "Guardar", show: true },
    { id: "Return", name: "Volver", show: true }
  ];

  buttonName: ElementRef;

  // set focus when init the component
  @ViewChild('name', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
      this.buttonName = content;
    }
  }

  @ViewChild('elementForm') elementForm: ElementRef;

  constructor(private productsService: ProductsService, private route: ActivatedRoute, private location: Location, formBuilder: FormBuilder) {

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
      this.id = +params.get('id');
      this._docSub = this.productsService.getProducts$().subscribe(products => {
        this.product = this.productsService.getProduct(this.id);
        this.loadProduct(this.product);
      });
    });
  }

  loadProduct(product: Product) {
    //if (product) {
      this.formGroup.patchValue({
        id: product?.id,
        name: product?.name,
        price: product?.price,
        type: product?.type,
        stock: product?.stock
      });
    //}
  }

  activateButtonType(id: string) {
    this.buttons.find(button => { return button.id == id }).show = true;
  }

  disableButtonType(id: string) {
    this.buttons.find(button => { return button.id == id }).show = false;
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
      this.buttonName.nativeElement.focus();
    }     
    else if(this.formGroup.valid){
    this.repeatedProduct = "";
      this.productsService.postEditProduct(this.formGroup.value).subscribe(response => {
        this.updatedProduct.show = true;
        this.updatedProduct.product = response;
        this.loadProduct(this.updatedProduct.product);
        setTimeout(() => { this.updatedProduct.show = false }, 5000);
      });

    } else {
      this.elementForm.nativeElement.querySelector('.ng-invalid').focus();
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
