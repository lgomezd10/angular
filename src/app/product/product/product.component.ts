import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { ActivatedRoute } from '@angular/router';
import { TYPES } from '../products-types';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ButtonType } from 'src/app/tools/button-type';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  //private products$: Observable<Product[]>;
  product: Product;
  public types = TYPES;
  updatedProduct = {
    show: false,
    product: null
  }
  buttons: ButtonType[] = [
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
    this.buttons.find(button => { return button.id == id}).show = true;
  }

  disableButtonType(id: string) {
    this.buttons.find(button => { return button.id == id}).show = false;
  }

  showButtonType(button: string) {
    if (button == "Return") {
      this.return();
    }
    if (button == "Save") {
      this.editProduct();
    }    
  }

  editProduct() {
    if(this.product.price <= 0)
      alert("el price debe ser mayor que 0");
    else 
      this.productsService.postEditProduct(this.product).subscribe(response => {
        this.updatedProduct.show = true;
        this.updatedProduct.product = response; 
        setTimeout(() => {this.updatedProduct.show = false}, 5000);
      })
  }

  return(){
    this.location.back();
  }

}
