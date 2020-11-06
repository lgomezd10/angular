import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ItemSale } from '../item-sale';
import { Product } from 'src/app/product/product';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/product/products.service';
import { SalesService } from '../sales.service';
import { ButtonType } from 'src/app/tools/button-type';
import { ToolsService } from 'src/app/tools/tools.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '@app/tools/form-errors';

const nameButtonTypes = { newSale: 'NuevaSale', closeSale: 'FinalizarSale', addProduct: 'AddProduct', add: 'Add', reopenTicket: 'ReabrirTicket' };

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})


export class SalesComponent implements OnInit {

  @ViewChild('find', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
    }
  }
  @ViewChild('send', { static: false }) goToSummit: ElementRef;

  @ViewChild('elementForm') elementForm: ElementRef;

  formGroup: FormGroup;
  items: ItemSale[] = [];

  saleId: number = 0;
  creditCard: boolean = false;
  open: boolean = false;
  findSale: number = 0;
  currentItem: ItemSale;
  searchText: string;
  showNew: boolean = false;
  products$: Observable<Product[]>;
  //total: number=0;

  buttons: ButtonType[] = [
    { id: nameButtonTypes.newSale, name: "Nueva venta", show: false },
    { id: nameButtonTypes.closeSale, name: "Finalizar venta", show: false },
    { id: nameButtonTypes.addProduct, name: "Añadir producto", show: true },
    { id: nameButtonTypes.add, name: "Añadir", show: false },
    { id: nameButtonTypes.reopenTicket, name: "Reabrir ticket", show: false }
  ];

  constructor(private productsService: ProductsService, private salesService: SalesService,
    private toolsService: ToolsService, formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      'find': [''],
      'product': [null, Validators.required],
      'quantity': ['', Validators.compose([Validators.required, Validators.min(0.01)])]
    });
  }


  ngOnInit() {
    this.products$ = this.productsService.getProducts$();
    this.toolsService.activateFocus(nameButtonTypes.addProduct);
  }

  activateButtonType(id: string) {
    this.buttons.find(boton => { return boton.id == id }).show = true;
  }

  disableButtonType(id: string) {
    this.buttons.find(boton => { return boton.id == id }).show = false;
  }

  showButtonType(boton: string) {
    if (boton == nameButtonTypes.addProduct) {
      this.newProduct();
      this.searchText = "";
      this.disableButtonType(boton);
      this.activateButtonType(nameButtonTypes.add);
    }

    if (boton == nameButtonTypes.add) {
      this.onSubmit();

    }
    if (boton == nameButtonTypes.closeSale) {
      this.closeSale();
    }
    if (boton == nameButtonTypes.newSale) {
      this.newSale();
    }
    if (boton == nameButtonTypes.reopenTicket) {
      this.openSale(this.saleId);
      this.open = true;
      this.activateButtonType(nameButtonTypes.addProduct);
      this.disableButtonType(nameButtonTypes.reopenTicket);
      this.activateButtonType(nameButtonTypes.closeSale);
      this.toolsService.activateFocus(nameButtonTypes.addProduct);
    }
  }

  newProduct() {
    this.currentItem = new ItemSale();
    this.formGroup.reset();
    this.showNew = true;
    this.activateButtonType(nameButtonTypes.newSale);
  }

  totalSale(): number {
    let suma = 0;
    this.items.forEach(item => {
      let quantity = item.price * item.quantity;
      quantity = Math.round(quantity * 100) / 100;
      suma = Math.round((suma + quantity) * 100) / 100;
    });
    return suma;
  }

  deleteItem(sale: ItemSale) {
    this.items.splice(this.items.indexOf(sale), 1);
    //this.totalSale = this.totalSale();

  }

  addPurchaseToList() {
    let itemSale = this.items.find(item => ((item.product.name == this.currentItem.product.name) && (item.price == this.currentItem.product.price)));

    if (!itemSale) {
      this.currentItem.price = this.currentItem.product.price;
      this.items.push(this.currentItem);
    } else {
      itemSale.quantity = this.currentItem.quantity + itemSale.quantity;
    }
    this.showNew = false;
    //this.totalSale = this.totalSale();
    this.activateButtonType(nameButtonTypes.closeSale);
    this.activateButtonType(nameButtonTypes.addProduct);
    this.disableButtonType(nameButtonTypes.add);
    this.toolsService.activateFocus(nameButtonTypes.addProduct);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.currentItem.product = this.formGroup.value.product;
      this.currentItem.quantity = this.formGroup.value.quantity;
      this.addPurchaseToList();
    } else {
      this.elementForm.nativeElement.querySelector('.ng-invalid').focus();
    }
  }

  closeSale(): void {
    if (this.saleId == 0)
      this.salesService.saveSales(this.items, this.creditCard).subscribe(cod => this.saleId = cod);
    else
      this.salesService.updateSales(this.saleId, this.items, this.creditCard).subscribe(cod => {
        this.saleId = cod;
        if (cod == 0) {
          window.alert("Se ha eliminado la compra tras eliminar sus elementos");
          this.resetSales();
        }
      });
    this.showNew = false;
    this.open = false;
    this.disableButtonType(nameButtonTypes.closeSale);
    this.disableButtonType(nameButtonTypes.add);
    this.disableButtonType(nameButtonTypes.addProduct);
    this.activateButtonType(nameButtonTypes.reopenTicket);
    this.toolsService.activateFocus(nameButtonTypes.reopenTicket);
  }


  openSale(saleId: number) {
    this.salesService.getSale(saleId).subscribe(sale => {

      this.items = sale.itemsSale;
      this.saleId = sale.id;
      this.creditCard = sale.creditCard;
      this.open = true;
      this.activateButtonType(nameButtonTypes.closeSale);
    },
      error => {
        console.log(`No se ha encontrado la compra ${saleId}`);
      }

    );
  }

  resetSales() {
    this.items = [];
    this.showNew = false;
    this.creditCard = false;
    //this.totalSale =0;
    this.saleId = 0;
    this.disableButtonType(nameButtonTypes.newSale);
    this.disableButtonType(nameButtonTypes.closeSale);
    this.activateButtonType(nameButtonTypes.addProduct);
    this.disableButtonType(nameButtonTypes.add);
    this.disableButtonType(nameButtonTypes.reopenTicket);
    this.toolsService.activateFocus(nameButtonTypes.addProduct);

  }

  newSale(): void {
    if (this.saleId == 0 && this.items.length > 0) {
      var statusConfirm = confirm("¿Desea crear una nueva venta? La venta actual no se ha guardado");
      if (statusConfirm) this.resetSales();
    } else {
      this.resetSales();
    }
  }

  // envento sent por router-outlet al activar la pagina
  /* onActivate(elementRef) {
     this.ngOnInit();
   }*/

  keyPress(key: KeyboardEvent, field: HTMLElement) {
    if (key.code == "Enter") { // press Enter      
      if (this.goToSummit.nativeElement == field) {
        this.toolsService.activateFocus("Add");
      } else {
        field.focus();
        // let cosa: HTMLInputElement = campo;
        // cosa.select
      }
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

}
