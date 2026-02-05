import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ItemSale } from '../item-sale';
import { Product } from 'src/app/product/product';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/product/products.service';
import { SalesService } from '../sales.service';
import { ButtonType } from 'src/app/tools/button-type';
import { ButtonListComponent } from '@app/tools/button-list/button-list.component';
import { ToolsService } from 'src/app/tools/tools.service';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormErrors } from '@app/tools/form-errors';
import { DecimalPipe } from '@angular/common';
import { ShowErrorsComponent } from '@app/errores/show-errors/show-errors.component';
import { TableModule } from 'primeng/table';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { CommonFormComponent } from '@app/tools/common-form/common-form.component';

const nameButtonTypes = { newSale: 'NuevaSale', closeSale: 'FinalizarSale', addProduct: 'AddProduct', reopenTicket: 'ReabrirTicket' };

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule, ButtonListComponent, CommonFormComponent,
    FormsModule, DecimalPipe, ShowErrorsComponent, TableModule,
    MenubarModule, MenuModule, InputTextModule, ButtonModule, MultiSelectModule, SelectModule, CheckboxModule, MessageModule
  ]
})
export class SalesComponent implements OnInit {

  @ViewChild('find', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
    }
  }
  @ViewChild('send', { static: false }) goToSummit: ElementRef;
  @ViewChild('elementForm') elementForm: ElementRef;

  buttons: ButtonType[] = [];

  formGroup: UntypedFormGroup;
  saleList: ItemSale[] = [];

  saleId: number = 0;
  creditCard: boolean = false;
  open: boolean = false;
  findSale: number = 0;
  currentItem: ItemSale;
  searchText: string;
  showNew: boolean = false;
  products$: Observable<Product[]>;
  formFields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'select';
    options$?: Observable<any[]>;
    placeholder?: string;
  }>;
  showSuccessMessage: string = '';

  constructor(
    private readonly productsService: ProductsService,
    private readonly salesService: SalesService,
    private readonly toolsService: ToolsService,
    formBuilder: UntypedFormBuilder
  ) {
    this.formGroup = formBuilder.group({
      'find': [''],
      'product': [null, Validators.required],
      'quantity': ['', Validators.compose([Validators.required, Validators.min(0.01)])]
    });

    this.buttons = [
      { id: nameButtonTypes.newSale, name: "Nueva venta", show: false, focused: false },
      { id: nameButtonTypes.closeSale, name: "Finalizar venta", show: false, focused: false },
      { id: nameButtonTypes.addProduct, name: "Añadir producto", show: true, focused: true },
      { id: nameButtonTypes.reopenTicket, name: "Reabrir ticket", show: false, focused: false }
    ];
  }

  ngOnInit() {
    this.products$ = this.productsService.getProducts$();    
    this. formFields = [
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
      }
    ];
    
  }

  activateButtonType(id: string) {
    let boton =  this.buttons.find(boton => boton.id == id);
    if (boton)
      boton.show = true;
  }

  activateButtonFocus(targetId: string) {
    // Primero quita el focused a todos los botones
    this.buttons = this.buttons.map(b => ({ ...b, focused: false }));
    // Luego activa el botón correspondiente
    this.buttons = this.buttons.map(b => ({ ...b, focused: b.id === targetId }));
  }

  disableButtonType(id: string) {
    let boton =  this.buttons.find(boton => boton.id == id);
    if (boton)
      boton.show = false;
  }

  showButtonType(boton: string) {
    this.showSuccessMessage = '';
    this.toolsService.cleanShowErrorsComponent();
    if (boton == nameButtonTypes.addProduct) {
      this.newProduct();
      this.searchText = "";
      this.showNew = true;
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
      this.activateButtonFocus(nameButtonTypes.addProduct);
    }
  }

  newProduct() {
    this.currentItem = new ItemSale();
    this.formGroup.reset();
    this.showNew = true;    
  }

  totalSale(): number {
    let suma = 0;
    this.saleList.forEach(item => {
      let quantity = item.price * item.quantity;
      quantity = Math.round(quantity * 100) / 100;
      suma = Math.round((suma + quantity) * 100) / 100;
    });
    return suma;
  }

  deleteItem(sale: ItemSale) {
    this.saleList.splice(this.saleList.indexOf(sale), 1);
    if (this.saleList.length == 0 && this.saleId == 0) {
      this.disableButtonType(nameButtonTypes.newSale);
      this.disableButtonType(nameButtonTypes.closeSale);
    }
  }

  addPurchaseToList() {
    let itemSale = this.saleList.find(item => ((item.product.name == this.currentItem.product.name) && (item.price == this.currentItem.product.price)));
    if (itemSale) {
      itemSale.quantity = this.currentItem.quantity + itemSale.quantity;
    } else {
      this.currentItem.price = this.currentItem.product.price;      
      this.saleList.push(this.currentItem);
    }
    this.showNew = false;
    this.activateButtonType(nameButtonTypes.closeSale);
    this.activateButtonType(nameButtonTypes.addProduct);
    this.activateButtonFocus(nameButtonTypes.addProduct);
    if (this.saleList.length > 0)
      this.activateButtonType(nameButtonTypes.newSale);
  }

  onSubmit(action: string) {
    this.showNew = false;
    if (action === 'submit') {    
      if (this.formGroup.valid) {
        this.currentItem.product = this.formGroup.value.product;
        this.currentItem.quantity = this.formGroup.value.quantity;
        this.addPurchaseToList();
      } else {
        this.elementForm.nativeElement.querySelector('.ng-invalid').focus();
      }
    }
    
  }

  closeSale(): void {
    this.saveSale();
  }

  saveSale(): void {
    if (this.saleId == 0)
      this.salesService.saveSales(this.saleList, this.creditCard).subscribe(cod => {
        this.saleId = cod;
        this.showSuccessMessage = `Compra finalizada. Código Venta: ${this.saleId}`;
      });
    else
      this.salesService.updateSales(this.saleId, this.saleList, this.creditCard).subscribe(cod => {
        this.saleId = cod;
        this.showSuccessMessage = `Compra finalizada. Código Venta: ${this.saleId}`;
        if (cod == 0) {
          this.resetSales();
          this.showSuccessMessage = 'Se ha eliminado la compra tras eliminar sus elementos';
        }
      });
    this.showNew = false;
    this.open = false;
    this.activateButtonType(nameButtonTypes.reopenTicket);
    this.disableButtonType(nameButtonTypes.addProduct);
    this.disableButtonType(nameButtonTypes.closeSale);
    this.disableButtonType(nameButtonTypes.addProduct);
    this.activateButtonFocus(nameButtonTypes.reopenTicket);
  }

  openSale(saleId: number) {
    this.showSuccessMessage = '';
    this.salesService.getSale(saleId).subscribe({
      next: sale => {
        this.saleList = sale.itemsSale;
        this.saleId = sale.id;
        this.creditCard = sale.creditCard;
        this.open = true;
        this.activateButtonType(nameButtonTypes.closeSale);
        this.activateButtonType(nameButtonTypes.addProduct);
        this.activateButtonType(nameButtonTypes.newSale);
      },
      error: () => {
        this.resetSales();
        console.log(`No se ha encontrado la compra ${saleId}`);
      }
    });
  }

  resetSales() {
    this.saleList = [];
    this.showNew = false;
    this.creditCard = false;
    this.saleId = 0;
    this.disableButtonType(nameButtonTypes.newSale);
    this.disableButtonType(nameButtonTypes.closeSale);
    this.activateButtonType(nameButtonTypes.addProduct);
    this.disableButtonType(nameButtonTypes.reopenTicket);
    this.activateButtonFocus(nameButtonTypes.addProduct);
  }

  newSale(): void {
    if (this.saleId == 0 && this.saleList.length > 0) {
      let statusConfirm = confirm("¿Desea crear una nueva venta? La venta actual no se ha guardado");
      if (statusConfirm) this.resetSales();
    } else {
      this.resetSales();
    }
  }

  keyPress(key: KeyboardEvent, field: HTMLElement) {
    if (key.code == "Enter") {
        field.focus();
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