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
    {id:"Guardar" ,name:"Guardar", mostrar:true},
    {id:"Volver",name:"Volver", mostrar:true}
  ];

  constructor(private productsService: ProductsService, private route: ActivatedRoute, private location: Location) {
    this.route.paramMap.subscribe(params => {
      this.productsService.getProducts$().subscribe(products => {
        this.product = this.productsService.getProduct(+params.get('productId')); 
      });      
    });
   }
  
  activarButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = true;
  }

  desactivarButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id}).mostrar = false;
  }

  mostrarButtonType(boton: string) {
    if (boton == "Volver") {
      this.volver();
    }
    if (boton == "Guardar") {
      this.modificarProduct();
    }    
  }

  modificarProduct() {
    if(this.product.price <= 0)
      alert("el price debe ser mayor que 0");
    else 
      this.productsService.postModificarProduct(this.product).subscribe(product => {console.log("Respuesta tras guardar product", product);})
  }

  volver(){
    this.location.back();
  }

}
