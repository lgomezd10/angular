import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from '../product';
import { RouterModule } from '@angular/router';
import { ButtonType } from 'src/app/tools/button-type';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortPipe } from '../sort.pipe';
import { FilterPipe } from '../filter.pipe';
import { ButtonListComponent } from '@app/tools/button-list/button-list.component';
import { NewComponent } from '@app/product/new/new.component';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolsService } from '@app/tools/tools.service';
import { ShowErrorsComponent } from "@app/errores/show-errors/show-errors.component";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [FormsModule, SortPipe, FilterPipe, RouterModule, ButtonModule, ReactiveFormsModule,
    ButtonListComponent, NewComponent, MessageModule, TableModule, ShowErrorsComponent]
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  showNewProduct: boolean = false;
  updatedProduct = {
    show: false,
    product: null
  }
  botones: ButtonType[] = [
    { id: "AddNew", name: "Añadir nuevo", show: true }
  ];

  searchText: any;
  oldPrice: any;
  event$: Product;
  oldProducts: Product[];

  constructor(private readonly productsService: ProductsService,
    private readonly toolsService: ToolsService) {}

  ngOnInit() {
    this.toolsService.setButtonTypes(this.botones);
    this.productsService.getProducts$().subscribe(products => this.products = products.map(product => ({ ...product })));
  }

  activateButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id }).show = true;
  }

  disableButtonType(id: string) {
    this.botones.find(boton => { return boton.id == id }).show = false;
  }

  showButtonType(boton: string) {
    if (boton == "AddNew") {
      this.showNewProduct = true;
    }

  }

  saveProduct(product: Product) {
    if (product.price <= 0) {
      alert("El precio debe ser mayor que 0");
    }
    else
      this.productsService.postEditProduct(product).subscribe({
    next: response => {

        this.updatedProduct.show = true;
        this.updatedProduct.product = response;
        setTimeout(() => { this.updatedProduct.show = false }, 5000);
      },
      error: () => {
        this.oldProducts = this.productsService.getProducts().map(product => ({ ...product }));
        this.products = this.oldProducts;
      }
    });
  }

  endNewProduct(response: string) {
    console.log('Nuevo producto guardado:', response);
    this.activateButtonType("AddNew");
    this.showNewProduct = false;
  }
}
