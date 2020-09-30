import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { ProductsService } from 'src/app/product/products.service';
import { Compra } from '../purchases';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from 'src/app/product/product';
import { purchasesService } from '../purchases.service';
import { ButtonType } from 'src/app/tools/button-type';
import { toolsService } from 'src/app/tools/tools.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const nameButtonTypees = { enviarCompra: 'EnviarCompra', crearProduct: 'CrearProduct', addProduct: 'AddProduct', add: 'Add' };

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {

  @ViewChild('buscar', { static: false }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus();
    }
  }
  @ViewChild('enviar', { static: false }) pasarASummit: ElementRef;
  @ViewChild('elementoForm') elementoForm: ElementRef;

  formulario: FormGroup;
  purchases: Compra[] = [];
  compraActual: Compra;
  searchText: string;
  products$: Observable<Product[]>;
  showNew: boolean = false;
  showNewProduct: boolean = false;
  //total: number = 0;
  compraFinalizada: boolean = false;
  myDateValue: Date = new Date();
  botones: ButtonType[] = [
    { id: nameButtonTypees.enviarCompra, name: "Enviar compra", show: false },
    { id: nameButtonTypees.crearProduct, name: "Crear product", show: true },
    { id: nameButtonTypees.addProduct, name: "Añadir product", show: true },
    { id: nameButtonTypees.add, name: "Añadir", show: false }
  ];

  constructor(private productsService: ProductsService, private purchasesService: purchasesService,
    private toolsServices: toolsService, formBuilder: FormBuilder) {
    this.formulario = formBuilder.group({
      'buscar': [''],
      'product': [null, Validators.required],
      'quantity': ['', Validators.compose([Validators.required, Validators.min(0.01)])],
      'price': ['', Validators.compose([Validators.required, Validators.min(0.01)])]

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
    if (boton == nameButtonTypees.addProduct) {
      this.showNewProduct = false;
      this.newProduct();
      this.desactivarButtonType(boton);
      this.activarButtonType(nameButtonTypees.add);
      this.activarButtonType(nameButtonTypees.crearProduct);
      //console.log("DESDE purchases COMPONENT este es el hijo autofoco", this.autoFoco);
      //setTimeout(() => this.autoFoco.nativeElement.focus(), 100);
      //this.autoFoco.nativeElement.focus();
    }
    if (boton == nameButtonTypees.crearProduct) {
      this.desactivarButtonType(boton);
      this.activarButtonType(nameButtonTypees.addProduct);
      this.desactivarButtonType(nameButtonTypees.add);
      this.showNewProduct = true;
      this.showNew = false;
    }
    if (boton == nameButtonTypees.add) {
      this.onSubmit();
    }
    if (boton == nameButtonTypees.enviarCompra) {
      this.enviarCompra();
    }
  }

  cargar() {
    let compra = this.purchases.find(compra => compra.product.name == this.compraActual.product.name);

    if (compra == undefined || compra.price != this.compraActual.price) {
      this.purchases.push(this.compraActual);
    } else {
      compra.quantity = compra.quantity + this.compraActual.quantity;
    }
    //this.total = this.totalCompra();
    this.showNew = false;
    this.activarButtonType(nameButtonTypees.addProduct);
    this.desactivarButtonType(nameButtonTypees.add);
    this.activarButtonType(nameButtonTypees.enviarCompra);
    this.toolsServices.activarFoco(nameButtonTypees.addProduct);

  }

  onSubmit() {
    if (this.formulario.valid) {
      this.compraActual.product = this.formulario.value.product;
      this.compraActual.quantity = this.formulario.value.quantity;
      this.compraActual.price = this.formulario.value.price;
      this.cargar();
    } else {
      this.formulario.markAllAsTouched();
      this.elementoForm.nativeElement.querySelector('.ng-invalid').focus();
    }
  }

  newProduct() {
    this.compraActual = new Compra();
    this.formulario.reset();
    this.showNew = true;
    this.searchText = "";
  }

  newGuardado(product: Product) {
    console.log("DESDE purchases COMPONET: Recibido evento de newGuardado");
    this.activarButtonType(nameButtonTypees.addProduct);
    this.activarButtonType(nameButtonTypees.crearProduct);
    this.toolsServices.activarFoco(nameButtonTypees.addProduct);
  }

  totalCompra(): number {
    let suma = 0;
    this.purchases.forEach(compra => {
      let quantity = compra.price * compra.quantity;
      quantity = Math.round(quantity * 100) / 100;
      suma = Math.round((suma + quantity) * 100) / 100;
    });
    return suma;
  }

  eliminarCompra(compra: Compra) {
    this.purchases.splice(this.purchases.indexOf(compra), 1);
    //this.total = this.totalCompra();
  }

  enviarCompra() {
    console.log(this.myDateValue);
    if (this.purchases.length == 0)
      alert("No hay products comprados");
    else {
      this.purchasesService.guardarCompra(this.purchases).subscribe(resp => this.compraFinalizada = true);
      this.desactivarButtonType(nameButtonTypees.addProduct);
      this.desactivarButtonType(nameButtonTypees.crearProduct);
      this.desactivarButtonType(nameButtonTypees.enviarCompra);
    }
  }  

  procesarKeypress(key: KeyboardEvent, campo: HTMLElement) {
    if (key.keyCode == 13) { // press Enter      
      if (this.pasarASummit.nativeElement == campo) {
        this.toolsServices.activarFoco(nameButtonTypees.add);
      } else {
        campo.focus();
      }

    }
  }

  onChange(e, campo) {
    campo.focus();
  }

}
