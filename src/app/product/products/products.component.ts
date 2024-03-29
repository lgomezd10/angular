import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ButtonType } from 'src/app/tools/button-type';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products$: Observable<Product[]>;
  showModal: boolean = false;
  new = false;
    updatedProduct = {
      show: false,
      product: null
    }
  botones: ButtonType[] = [
    { id: "AddNew", name: "Añadir nuevo", show: true }
  ];

  @ViewChild('modal') modal: ElementRef;

  constructor(private productsService: ProductsService, private route: ActivatedRoute) {
    
    
    /*route.url.subscribe(url => {
      if (this.products == null) {
        this.products$ = this.productsService.getProducts$();
        this.products$.subscribe(products => {
          this.products = products;
          this.new = false;
        });
      }
    })*/
  }
 

  ngOnInit() {
    
    //TODO al cargar aquí los productos, se están cargando dos veces (desde aquí y desde el service) pero si no se carga desde aquí no se actualiza
    this.productsService.loadProducts();
    this.products$ = this.productsService.getProducts$().pipe(
      tap((value) => {
        this.new = false;
      })
    );
    this.productsService.getProducts$().subscribe(products => {
      console.log("peticion al servidor", products);
    })
    /* this.products$.subscribe(products => {
      this.products = products;
      this.new = false;
    }); */
  }

  

  activateButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id }).show = true;
  }

  disableButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id }).show = false;
  }

  showButtonType(boton: string) {
    if (boton == "AddNew") {
      /*
      this.new = true;
      this.disableButtonType("AddNew");
      //this.disableButtonType("Añadir new");
      */
     this.showModal = true;
     this.modal.nativeElement.classList.add('is-active');

    }

  }
  closeModal() {
    this.modal.nativeElement.classList.remove('is-active');
    this.showModal = false;
  }

  changePrice(product: Product, oldPrice) {
    if (product.price <= 0) {

      alert("el price debe ser mayor que 0");
    }
    else
      this.productsService.postEditProduct(product).subscribe(response => { 
        
        this.updatedProduct.show = true;
        this.updatedProduct.product = response; 
        setTimeout(() => {this.updatedProduct.show = false}, 5000);
      });
  }

  savedNewProduct(product: Product) {
    this.activateButtonType("AddNew");
  }




}
