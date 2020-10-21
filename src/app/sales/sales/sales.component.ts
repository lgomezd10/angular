import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Sale } from '../sale';
import { Product } from 'src/app/product/product';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/product/products.service';
import { SalesService } from '../sales.service';
import { ButtonType } from 'src/app/tools/button-type';
import { ToolsService } from 'src/app/tools/tools.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  sales: Sale[] = [];
  
  saleId: number = 0;
  creditCard: boolean = false;
  open: boolean = false;
  findSale: number = 0;
  currentSale: Sale;
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
      this.open = true;
      this.activateButtonType(nameButtonTypes.addProduct);
      this.disableButtonType(nameButtonTypes.reopenTicket);
      this.activateButtonType(nameButtonTypes.closeSale);
      this.toolsService.activateFocus(nameButtonTypes.addProduct);
    }
  }

  newProduct() {
    this.currentSale = new Sale();
    this.formGroup.reset();
    this.showNew = true;
    this.activateButtonType(nameButtonTypes.newSale);
  }

  totalSale(): number {
    let suma = 0;
    this.sales.forEach(sale => {
      let quantity = sale.price * sale.quantity;
      quantity = Math.round(quantity * 100) / 100;
      suma = Math.round((suma + quantity) * 100) / 100;
    });
    return suma;
  }

  eliminarSale(sale: Sale) {
    this.sales.splice(this.sales.indexOf(sale), 1);
    //this.totalSale = this.totalSale();

  }

  addPurchaseToList() {
    console.log(this.currentSale.product);

    let sale = this.sales.find(sale => sale.product.name == this.currentSale.product.name);

    if (sale == undefined) {
      this.currentSale.price = this.currentSale.product.price;
      this.sales.push(this.currentSale);
    } else {
      sale.quantity = this.currentSale.quantity + sale.quantity;
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
      this.currentSale.product = this.formGroup.value.product;
      this.currentSale.quantity = this.formGroup.value.quantity;
      this.addPurchaseToList();
    } else {
      this.elementForm.nativeElement.querySelector('.ng-invalid').focus();
    }
  }

  closeSale(): void {
    if (this.saleId == 0)
      this.salesService.saveSales(this.sales, this.creditCard).subscribe(cod => this.saleId = cod);
    else
      this.salesService.updateSales(this.saleId, this.sales, this.creditCard).subscribe(cod => this.saleId = cod);
    this.showNew = false;
    this.open = false;
    this.disableButtonType(nameButtonTypes.closeSale);
    this.disableButtonType(nameButtonTypes.add);
    this.disableButtonType(nameButtonTypes.addProduct);
    this.activateButtonType(nameButtonTypes.reopenTicket);    
    this.toolsService.activateFocus(nameButtonTypes.reopenTicket);
  }

  
  openSale(salesId: number) {
    this.salesService.obtenerSale(salesId).subscribe(sales => {
      
      this.sales = sales.sale;
      this.saleId = sales.id;
      this.creditCard = sales.creditCard;      
      this.open = true;
      this.activateButtonType(nameButtonTypes.closeSale);
   
    error => {
      console.log(`No se ha encontrado la compra ${salesId}`);
    }
      
    });
  }

  resetSales() {
    this.sales = [];
    this.showNew = false;
    this.creditCard = false;
    //this.totalSale =0;
    this.saleId = 0;
    this.activateButtonType(nameButtonTypes.newSale);
    this.disableButtonType(nameButtonTypes.closeSale);
    this.activateButtonType(nameButtonTypes.addProduct);
    this.disableButtonType(nameButtonTypes.add);
    this.disableButtonType(nameButtonTypes.reopenTicket);

  }

  newSale(): void {
    if (this.saleId == 0 && this.sales.length > 0) {
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

  keyPress(key: KeyboardEvent, campo: HTMLElement) {
    if (key.keyCode == 13) { // press Enter      
      if (this.goToSummit.nativeElement == campo) {
        console.log("DESDE sales COMPONENTE TS: Se va a send el foco a button-list", "Add");
        this.toolsService.activateFocus("Add");
      } else {
        console.log("El atributo de campo es", campo.getAttributeNames());
        campo.focus();
        // let cosa: HTMLInputElement = campo;
        // cosa.select
      }
    }
  }


  onChange(e, campo) {
    campo.focus();
  }

}
