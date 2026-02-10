import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductsService } from '../../product/products.service';
import { Purchase } from '../purchase';
import { Observable } from 'rxjs';
import { Product } from '../../product/product';
import { PurchasesService } from '../purchases.service';
import { ButtonType } from '../../tools/button-type';
import { ToolsService } from '../../tools/tools.service';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormErrors } from '../../tools/form-errors';
import { ProductPipe } from '../../product/product.pipe';
import { DecimalPipe } from '@angular/common';
import { ShowErrorsComponent } from '../../errores/show-errors/show-errors.component';
import { NewComponent } from '../../product/new/new.component';
import { ButtonListComponent } from '../../tools/button-list/button-list.component';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber'
import { CommonFormComponent } from "../../tools/common-form/common-form.component";
import { MessageModule } from 'primeng/message';
import { CommonFormField } from '../../tools/common-form-field';

const nameButtonTypes = { sendPurchase: 'SendPruchase', newPurchase: 'NewPurchase', createProduct: 'CreateProduct', addProduct: 'AddProduct', add: 'Add' };

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css'],
  standalone: true,
  imports: [ProductPipe, ReactiveFormsModule,
    NewComponent, ButtonListComponent, DecimalPipe, TableModule, SelectModule, InputNumberModule, CommonFormComponent, ShowErrorsComponent, MessageModule]
})
export class PurchasesComponent implements OnInit {

  @ViewChild('find', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
    }
  }
  @ViewChild('send', { static: false }) goToSummit: ElementRef | undefined;
  @ViewChild('elementForm') elementForm: ElementRef | undefined;

  formGroup: UntypedFormGroup;
  purchaseList: Purchase[] = [];
  currentPurchase: Purchase = new Purchase();
  searchText: string = "";
  products$: Observable<Product[]> = new Observable<Product[]>();
  showNew: boolean = false;
  showNewProduct: boolean = false;
  purchaseCompleted: boolean = false;
  myDateValue: Date = new Date();
  formFields: Array<CommonFormField> = [];
  buttons: ButtonType[] = [
    { id: nameButtonTypes.sendPurchase, name: "Enviar compra", show: false, focused: false },
    { id: nameButtonTypes.newPurchase, name: "Nueva compra", show: false, focused: false },
    { id: nameButtonTypes.createProduct, name: "Crear producto", show: true, focused: false },
    { id: nameButtonTypes.addProduct, name: "Añadir producto", show: true, focused: true },
    { id: nameButtonTypes.add, name: "Añadir", show: false, focused: false }
  ];

  constructor(private readonly productsService: ProductsService, private readonly purchasesService: PurchasesService,
    private readonly toolsServices: ToolsService, formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      'find': [''],
      'product': [null, Validators.required],
      'quantity': ['', Validators.compose([Validators.required, Validators.min(0.01)])],
      'price': ['', Validators.compose([Validators.required, Validators.min(0.01)])]

    });

  }

  ngOnInit() {
    this.products$ = this.productsService.getProducts$();
    this.activateButtonFocus(nameButtonTypes.addProduct);
    this.formFields = [
      {
        name: 'product',
        label: 'Buscar producto',
        type: 'select',
        options$: this.products$,
        placeholder: 'Selecciona un producto'
      },
      {
        name: 'quantity',
        label: 'Cantidad',
        type: 'number',
        placeholder: 'Cantidad'
      },
      {
        name: 'price',
        label: 'Precio',
        type: 'number',
        placeholder: 'Precio'
      }
    ];
  }


  activateButtonType(id: string) {
    const button = this.buttons.find(boton => { return boton.id == id });
    if (button) {
      button.show = true;
    }
  }

  activateButtonFocus(targetId: string) {
    this.buttons = this.buttons.map(b => ({ ...b, focused: b.id === targetId }));
  }

  disableButtonType(id: string) {
    const button = this.buttons.find(boton => { return boton.id == id });
    if (button) {
      button.show = false;
    }
  }


  showButtonType(button: string) {
    if (button == nameButtonTypes.addProduct) {
      this.showNewProduct = false;
      this.newProduct();
      this.activateButtonType(nameButtonTypes.createProduct);
    }

    if (button == nameButtonTypes.newPurchase) {
      this.newPurchase();
    }
    if (button == nameButtonTypes.createProduct) {
      this.disableButtonType(button);
      this.activateButtonType(nameButtonTypes.addProduct);
      this.disableButtonType(nameButtonTypes.add);
      this.showNewProduct = true;
      this.showNew = false;
    }
    if (button == nameButtonTypes.sendPurchase) {
      this.sendPurchase();
    }
  }

  resetPurchase() {
    this.purchaseList = [];
    this.showNew = false;
    this.showNewProduct = false;
    this.disableButtonType(nameButtonTypes.add);
    this.disableButtonType(nameButtonTypes.sendPurchase);
    this.disableButtonType(nameButtonTypes.newPurchase);
    this.activateButtonType(nameButtonTypes.addProduct);
    this.activateButtonType(nameButtonTypes.createProduct);
    this.activateButtonFocus(nameButtonTypes.addProduct);
    this.purchaseCompleted = false;
  }

  newPurchase(): void {
    if (this.purchaseCompleted) {
      this.resetPurchase();
    } else {
      let statusConfirm = confirm("¿Desea crear una nueva compra? La compra actual no se ha guardado");
      if (statusConfirm) {
        this.resetPurchase();
      }
    }
  }

  addPurchaseToList() {
    let purchase = this.purchaseList.find(purchase => purchase.product.name == this.currentPurchase.product.name);

    if (purchase?.price == this.currentPurchase.price) {
      purchase.quantity = purchase.quantity + this.currentPurchase.quantity;
    } else {
      this.purchaseList.push(this.currentPurchase);
    }

    this.showNew = false;
    this.activateButtonType(nameButtonTypes.addProduct);
    this.disableButtonType(nameButtonTypes.add);
    this.activateButtonType(nameButtonTypes.sendPurchase);
    this.activateButtonType(nameButtonTypes.newPurchase);
    this.activateButtonFocus(nameButtonTypes.addProduct);

  }

  onSubmit(action: string) {
    this.showNew = false;
    if (action === 'submit') {
      if (this.formGroup.valid) {
        this.currentPurchase.product = this.formGroup.value.product;
        this.currentPurchase.quantity = this.formGroup.value.quantity;
        this.currentPurchase.price = this.formGroup.value.price;
        this.addPurchaseToList();
      } else {
        this.formGroup.markAllAsTouched();
        this.elementForm?.nativeElement.querySelector('.ng-invalid').focus();
      }
    }
  }

  newProduct() {
    this.currentPurchase = new Purchase();
    this.formGroup.reset();
    this.showNew = true;
    this.searchText = "";
  }

  endNewProduct(response: string) {
    console.log('Nuevo producto guardado:', response);
    this.activateButtonType(nameButtonTypes.addProduct);
    this.activateButtonType(nameButtonTypes.createProduct);
    this.activateButtonFocus(nameButtonTypes.addProduct);
    this.showNewProduct = false;
  }

  totalPurchase(): number {
    let total = 0;
    this.purchaseList.forEach(purchase => {
      let quantity = purchase.price * purchase.quantity;
      quantity = Math.round(quantity * 100) / 100;
      total = Math.round((total + quantity) * 100) / 100;
    });
    return total;
  }

  deletePurchase(purchase: Purchase) {
    this.purchaseList.splice(this.purchaseList.indexOf(purchase), 1);
  }

  sendPurchase() {
    if (this.purchaseList.length == 0)
      alert("No hay products comprados");
    else {
      this.purchasesService.guardarPurchase(this.purchaseList).subscribe(purchases => {
        this.purchaseCompleted = true;
        this.purchaseList = purchases;
      });
      this.disableButtonType(nameButtonTypes.addProduct);
      this.disableButtonType(nameButtonTypes.createProduct);
      this.disableButtonType(nameButtonTypes.sendPurchase);
      this.activateButtonFocus(nameButtonTypes.newPurchase);

    }
  }

  checkError(field: string): boolean {
    return FormErrors.checkError(field, this.formGroup)
  }

  getError(name: string, field: string): string {
    return FormErrors.getError(name, field, this.formGroup);
  }

}
