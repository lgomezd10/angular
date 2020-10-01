import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { ActivatedRoute } from '@angular/router';
import { TYPES } from '../products-types';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ButtonType } from 'src/app/tools/button-type';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  //private products$: Observable<Product[]>;
  product: Product;
  public types = TYPES;
  botones: ButtonType[] = [
    {id:"Save" ,name:"Guardar", show:true},
    {id:"Return",name:"Volver", show:true}
  ];

  constructor(private productsService: ProductsService, private route: ActivatedRoute, private location: Location) {
    this.route.paramMap.subscribe(params => {
      this.productsService.getProducts$().subscribe(products => {
        this.product = this.productsService.getProduct(+params.get('id')); 
      });      
    });
   }
  
  activateButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id}).show = true;
  }

  disableButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id}).show = false;
  }

  showButtonType(boton: string) {
    if (boton == "Return") {
      this.return();
    }
    if (boton == "Save") {
      this.editProduct();
    }    
  }

  editProduct() {
    if(this.product.price <= 0)
      alert("el price debe ser mayor que 0");
    else 
      this.productsService.postEditProduct(this.product).subscribe(product => {console.log("Response tras guardar product", product);})
  }

  return(){
    this.location.back();
  }

}
