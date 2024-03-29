import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { ProductsService } from 'src/app/product/products.service';
import { Purchase } from '../purchase';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/product/product';
import { PurchasesService } from '../purchases.service';
import { ButtonType } from 'src/app/tools/button-type';
import { ToolsService } from 'src/app/tools/tools.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '@app/tools/form-errors';

const nameButtonTypes = { sendPurchase: 'SendPruchase', newPurchase: 'NewPurchase', createProduct: 'CreateProduct', addProduct: 'AddProduct', add: 'Add' };

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  @ViewChild('find', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
    }
  }
  @ViewChild('send', { static: false }) goToSummit: ElementRef;
  @ViewChild('elementForm') elementForm: ElementRef;

  formGroup: FormGroup;
  purchases: Purchase[] = [];
  currentPurchase: Purchase;
  searchText: string;
  products$: Observable<Product[]>;
  showNew: boolean = false;
  showNewProduct: boolean = false;
  //total: number = 0;
  purchaseCompleted: boolean = false;
  myDateValue: Date = new Date();
  botones: ButtonType[] = [
    { id: nameButtonTypes.sendPurchase, name: "Enviar compra", show: false },
    { id: nameButtonTypes.newPurchase, name: "Nueva compra", show: false },
    { id: nameButtonTypes.createProduct, name: "Crear producto", show: true },
    { id: nameButtonTypes.addProduct, name: "Añadir producto", show: true },
    { id: nameButtonTypes.add, name: "Añadir", show: false }
  ];

  constructor(private productsService: ProductsService, private purchasesService: PurchasesService,
    private toolsServices: ToolsService, formBuilder: FormBuilder) {
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
  }

  
  activateButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id }).show = true;
  }

  disableButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id }).show = false;
  }


  showButtonType(button: string) {
    if (button == nameButtonTypes.addProduct) {
      this.showNewProduct = false;
      this.newProduct();
      this.disableButtonType(button);
      this.activateButtonType(nameButtonTypes.add);
      this.activateButtonType(nameButtonTypes.createProduct);
      //setTimeout(() => this.autoFoco.nativeElement.focus(), 100);
      //this.autoFoco.nativeElement.focus();
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
    if (button == nameButtonTypes.add) {
      this.onSubmit();
    }
    if (button == nameButtonTypes.sendPurchase) {
      this.sendPurchase();
    }
  }

  resetPurchase() {
    this.purchases = [];
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
    if (!this.purchaseCompleted) {
      var statusConfirm = confirm("¿Desea crear una nueva compra? La compra actual no se ha guardado");
      if (statusConfirm) {
        this.resetPurchase();
      } 
    } else {
      this.resetPurchase();
    }
  }

  addPurchaseToList() {
    let purchase = this.purchases.find(purchase => purchase.product.name == this.currentPurchase.product.name);
    

    if (purchase == undefined || purchase.price != this.currentPurchase.price) {
      this.purchases.push(this.currentPurchase);
    } else {
      purchase.quantity = purchase.quantity + this.currentPurchase.quantity;
    }

    //this.total = this.totalPurchase();
    this.showNew = false;
    this.activateButtonType(nameButtonTypes.addProduct);
    this.disableButtonType(nameButtonTypes.add);
    this.activateButtonType(nameButtonTypes.sendPurchase);
    this.activateButtonType(nameButtonTypes.newPurchase);
    this.toolsServices.activateFocus(nameButtonTypes.addProduct);

  }

  onSubmit() {
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

  newProduct() {
    this.currentPurchase = new Purchase();
    this.formGroup.reset();
    this.showNew = true;
    this.searchText = "";
  }

  newGuardado(product: Product) {
    this.activateButtonType(nameButtonTypes.addProduct);
    this.activateButtonType(nameButtonTypes.createProduct);
    this.toolsServices.activateFocus(nameButtonTypes.addProduct);
  }

  totalPurchase(): number {
    let total = 0;
    this.purchases.forEach(purchase => {
      let quantity = purchase.price * purchase.quantity;
      quantity = Math.round(quantity * 100) / 100;
      total = Math.round((total + quantity) * 100) / 100;
    });
    return total;
  }

  deletePurchase(purchase: Purchase) {
    this.purchases.splice(this.purchases.indexOf(purchase), 1);
    //this.total = this.totalPurchase();
  }

  sendPurchase() {
    if (this.purchases.length == 0)
      alert("No hay products comprados");
    else {
      this.purchasesService.guardarPurchase(this.purchases).subscribe(purchases => {
        this.purchaseCompleted = true;
        this.purchases = purchases;      
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
