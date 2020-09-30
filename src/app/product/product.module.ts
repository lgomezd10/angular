import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { HttpClientModule }    from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NewComponent } from './new/new.component';
import { FilterPipe } from './filter.pipe';
import { ProductsService } from './products.service';
import { SortPipe } from './sort.pipe';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ProductPipe } from './product.pipe';
import { ProductComponent } from './product/product.component';
import { RouterModule } from '@angular/router';
import { ToolsModule } from '../tools/tools.module';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [ProductsComponent, NewComponent, FilterPipe, SortPipe, ProductPipe, ProductComponent],
  imports: [
    ToolsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SocketIoModule.forRoot(config)
  ],
  exports: [
    ProductsComponent, FilterPipe, SortPipe, ProductPipe, NewComponent, ProductComponent
  ], 
  providers: [
    ProductsService
  ]
})
export class ProductModule { }
