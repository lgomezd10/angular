import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonType } from 'src/app/tools/button-type';
import { FormsModule } from '@angular/forms';
import { SortPipe } from '../sort.pipe';
import { FilterPipe } from '../filter.pipe';
import { ButtonListComponent } from '@app/tools/button-list/button-list.component';
import { NewComponent } from '../new/new.component';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [AsyncPipe, FormsModule, SortPipe, FilterPipe, RouterModule, ButtonListComponent, NewComponent]
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
  searchText: any;
  oldPrice: any;
  event$: Product;

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
    
    console.log('ngOnInit ejecutado');
    this.productsService.loadProducts();
    this.products$ = this.productsService.getProducts$().pipe(
      tap((value) => {
        this.new = false;
        console.log('products$ emitió:', value);
      })
    );
    this.productsService.getProducts$().subscribe(products => {
      console.log("peticion al servidor", products);
    });
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
    console.log("Producto recibido del modal:", product);
    this.activateButtonType("AddNew");
  }




}
