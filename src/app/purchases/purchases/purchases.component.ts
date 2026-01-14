import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductsService } from 'src/app/product/products.service';
import { Purchase } from '../purchase';
import { Observable } from 'rxjs';
import { Product } from 'src/app/product/product';
import { PurchasesService } from '../purchases.service';
import { ButtonType } from 'src/app/tools/button-type';
import { ToolsService } from 'src/app/tools/tools.service';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormErrors } from '@app/tools/form-errors';
import { ProductPipe } from '@app/product/product.pipe';
import { DecimalPipe } from '@angular/common';
import { ShowErrorsComponent } from '@app/errores/show-errors/show-errors.component';
import { NewComponent } from '@app/product/new/new.component';
import { ButtonListComponent } from '@app/tools/button-list/button-list.component';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber'
import { CommonFormComponent } from "@app/tools/common-form/common-form.component";
import { MessageModule } from 'primeng/message';

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
  @ViewChild('send', { static: false }) goToSummit: ElementRef;
  @ViewChild('elementForm') elementForm: ElementRef;

  formGroup: UntypedFormGroup;
  purchaseList: Purchase[] = [];
  currentPurchase: Purchase;
  searchText: string;
  products$: Observable<Product[]>;
  showNew: boolean = false;
  showNewProduct: boolean = false;
  //total: number = 0;
  purchaseCompleted: boolean = false;
  myDateValue: Date = new Date();
  formFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'select';
    options$?: Observable<any[]>;
    placeholder?: string;
  }>;
  buttons: ButtonType[] = [
    { id: nameButtonTypes.sendPurchase, name: "Enviar compra", show: false },
    { id: nameButtonTypes.newPurchase, name: "Nueva compra", show: false },
    { id: nameButtonTypes.createProduct, name: "Crear producto", show: true },
    { id: nameButtonTypes.addProduct, name: "Añadir producto", show: true },
    { id: nameButtonTypes.add, name: "Añadir", show: false }
  ];

  constructor(private productsService: ProductsService, private purchasesService: PurchasesService,
    private toolsServices: ToolsService, formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      'find': [''],
      'product': [null, Validators.required],
      'quantity': ['', Validators.compose([Validators.required, Validators.min(0.01)])],
      'price': ['', Validators.compose([Validators.required, Validators.min(0.01)])]

    });

  }

  ngOnInit() {
    this.products$ = this.productsService.getProducts$();
    this.toolsServices.activateFocus(nameButtonTypes.addProduct);
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
    this.buttons.find(boton => { return boton.id == id }).show = true;
  }

  disableButtonType(id: string) {
    this.buttons.find(boton => { return boton.id == id }).show = false;
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
    this.toolsServices.activateFocus(nameButtonTypes.addProduct);
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

    if (purchase == undefined || purchase.price != this.currentPurchase.price) {
      this.purchaseList.push(this.currentPurchase);
    } else {
      purchase.quantity = purchase.quantity + this.currentPurchase.quantity;
    }

    this.showNew = false;
    this.activateButtonType(nameButtonTypes.addProduct);
    this.disableButtonType(nameButtonTypes.add);
    this.activateButtonType(nameButtonTypes.sendPurchase);
    this.activateButtonType(nameButtonTypes.newPurchase);
    this.toolsServices.activateFocus(nameButtonTypes.addProduct);

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
        this.elementForm.nativeElement.querySelector('.ng-invalid').focus();
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
    this.toolsServices.activateFocus(nameButtonTypes.addProduct);
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
      this.toolsServices.activateFocus(nameButtonTypes.newPurchase);

    }
  }

  keyPress(key: KeyboardEvent, campo: HTMLElement) {
    if (key.code == "Enter") { // press Enter      
      if (this.goToSummit.nativeElement == campo) {
        this.toolsServices.activateFocus(nameButtonTypes.add);
      } else {
        campo.focus();
      }

    }
  }

  checkError(field: string): boolean {
    return FormErrors.checkError(field, this.formGroup)
  }

  getError(name: string, field: string): string {
    return FormErrors.getError(name, field, this.formGroup);
  }

  onChange(e, campo) {
    campo.focus();
  }

}
