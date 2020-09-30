import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  new = false;
  botones: ButtonType[] = [
    {id:"AddNew",name:"Añadir new", mostrar:true}
  ];
  
  constructor(private productsService: ProductsService, private route:ActivatedRoute) {
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
    console.log("pasa por init")
    this.products$ = this.productsService.getProducts$().pipe(
      tap((value) => { this.new = false; }),
    );
    this.productsService.getProducts$().subscribe(products => {
      console.log("peticion al servidor", products);
    })
    /* this.products$.subscribe(products => {
      this.products = products;
      this.new = false;
    }); */
  }

  activarButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = true;
  }

  desactivarButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = false;
  }

  mostrarButtonType(boton: string) {
    if (boton == "AddNew") {
      this.new=true;
      this.desactivarButtonType("AddNew");
      //this.desactivarButtonType("Añadir new");
    }
    
  }

  cambioprice(product: Product, priceAntiguo) {
    if(product.price <= 0) {
      
      alert("el price debe ser mayor que 0");
    }
    else
      this.productsService.postModificarProduct(product).subscribe(product => {console.log(product);});
  }  

  newProductGuardado(product: Product) {
    console.log("DESDE PRODUCTS: Recibido evento de new product guardado");
    this.activarButtonType("AddNew");
  }
  

  

}
