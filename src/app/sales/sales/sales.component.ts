import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Sale } from '../sale';
import { Product } from 'src/app/product/product';
import { Observable } from 'rxjs';
import { ProductsService } from 'src/app/product/products.service';
import { SalesService } from '../sales.service';
import { ButtonType } from 'src/app/tools/button-type';
import { toolsService } from 'src/app/tools/tools.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const nameButtonTypees = { nuevaSale: 'NuevaSale', finalizarSale: 'FinalizarSale', addProduct: 'AddProduct', add: 'Add', reabrirTicket: 'ReabrirTicket' };

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})


export class SalesComponent implements OnInit {

  @ViewChild('buscar', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
    }
  }
  @ViewChild('enviar', { static: false }) pasarASummit: ElementRef;

  @ViewChild('elementoForm') elementoForm: ElementRef;

  formulario: FormGroup;
  sales: Sale[] = [];
  abierta: boolean = false;
  buscarSale: number = 0;
  saleActual: Sale;
  searchText: string;
  showNew: boolean = false;
  products$: Observable<Product[]>;
  seleccionado: Product;
  //total: number=0;
  codigoSale: number = 0;
  creditCard: boolean = false;

  botones: ButtonType[] = [
    { id: nameButtonTypees.nuevaSale, name: "Nueva sale", show: false },
    { id: nameButtonTypees.finalizarSale, name: "Finalizar sale", show: false },
    { id: nameButtonTypees.addProduct, name: "Añadir product", show: true },
    { id: nameButtonTypees.add, name: "Añadir", show: false },
    { id: nameButtonTypees.reabrirTicket, name: "Reabrir ticket", show: false }
  ];

  constructor(private productsService: ProductsService, private salesService: SalesService,
    private toolsService: toolsService, formBuilder: FormBuilder) {
    this.formulario = formBuilder.group({
      'buscar': [''],
      'product': [null, Validators.required],
      'quantity': ['', Validators.compose([Validators.required, Validators.min(0.01)])]
    });
  }


  ngOnInit() {
    this.products$ = this.productsService.getProducts$();
  }

  activarButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id }).show = true;
  }

  desactivarButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id }).show = false;
  }

  showButtonType(boton: string) {
    console.log("DESDE sales COMPONENT se activa el boton", boton);
    if (boton == nameButtonTypees.addProduct) {
      this.newProduct();
      this.searchText = "";
      this.desactivarButtonType(boton);
      this.activarButtonType(nameButtonTypees.add);
    }

    if (boton == nameButtonTypees.add) {
      this.onSubmit();

    }
    if (boton == nameButtonTypees.finalizarSale) {
      this.finalizarSale();
    }
    if (boton == nameButtonTypees.nuevaSale) {
      this.nuevaSale();
    }
    if (boton == nameButtonTypees.reabrirTicket) {
      this.abierta = true;
      this.activarButtonType(nameButtonTypees.addProduct);
      this.desactivarButtonType(nameButtonTypees.reabrirTicket);
      this.activarButtonType(nameButtonTypees.finalizarSale);
    }
  }

  newProduct() {
    this.saleActual = new Sale();
    this.formulario.reset();
    this.showNew = true;
    this.activarButtonType(nameButtonTypees.nuevaSale);
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

  cargar() {
    console.log(this.saleActual.product);

    let sale = this.sales.find(sale => sale.product.name == this.saleActual.product.name);

    if (sale == undefined) {
      this.saleActual.price = this.saleActual.product.price;
      this.sales.push(this.saleActual);
    } else {
      sale.quantity = this.saleActual.quantity + sale.quantity;
    }
    this.showNew = false;
    //this.totalSale = this.totalSale();
    this.activarButtonType(nameButtonTypees.finalizarSale);
    this.activarButtonType(nameButtonTypees.addProduct);
    this.desactivarButtonType(nameButtonTypees.add);
    this.toolsService.activarFoco(nameButtonTypees.addProduct);


  }

  onSubmit() {
    if (this.formulario.valid) {
      this.saleActual.product = this.formulario.value.product;
      this.saleActual.quantity = this.formulario.value.quantity;
      this.cargar();
    } else {
      this.elementoForm.nativeElement.querySelector('.ng-invalid').focus();
    }
  }

  finalizarSale(): void {
    if (this.codigoSale == 0)
      this.salesService.guardarSale(this.sales, this.creditCard).subscribe(cod => this.codigoSale = cod);
    else
      this.salesService.actualizarSale(this.codigoSale, this.sales, this.creditCard).subscribe(cod => this.codigoSale = cod);
    this.showNew = false;
    this.abierta = false;
    this.desactivarButtonType(nameButtonTypees.finalizarSale);
    this.desactivarButtonType(nameButtonTypees.add);
    this.desactivarButtonType(nameButtonTypees.addProduct);
    this.activarButtonType(nameButtonTypees.reabrirTicket);
    console.log("Desde finalizar sale", this.codigoSale);

  }

  abrirSale(salesId: number) {
    this.salesService.obtenerSale(salesId).subscribe(sales => {
      console.log("elementos recibidos", sales.elementos);
      this.sales = [];
      this.sales = this.salesService.salesAListaSale(sales);
      this.codigoSale = sales.salesId;
      this.creditCard = sales.creditCard;
      //this.totalSale = this.totalSale();
      this.abierta = true;
    });
    console.log("lo guardado en sales", this.sales);

  }

  reiniciar() {
    this.sales = [];
    this.showNew = false;
    //this.totalSale =0;
    this.codigoSale = 0;
    this.activarButtonType(nameButtonTypees.nuevaSale);
    this.desactivarButtonType(nameButtonTypees.finalizarSale);
    this.activarButtonType(nameButtonTypees.addProduct);
    this.desactivarButtonType(nameButtonTypees.add);
    this.desactivarButtonType(nameButtonTypees.reabrirTicket);

  }

  nuevaSale(): void {
    if (this.codigoSale == 0 && this.sales.length > 0) {
      var statusConfirm = confirm("¿Desea crear una nueva sale? La sale actual no se ha guardado");
      if (statusConfirm) this.reiniciar();
    } else {
      this.reiniciar();
    }
  }

  // envento enviado por router-outlet al activar la pagina
  /* onActivate(elementRef) {
     this.ngOnInit();
   }*/

  procesarKeypress(key: KeyboardEvent, campo: HTMLElement) {
    if (key.keyCode == 13) { // press Enter      
      if (this.pasarASummit.nativeElement == campo) {
        console.log("DESDE sales COMPONENTE TS: Se va a enviar el foco a button-list", "Add");
        this.toolsService.activarFoco("Add");
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
