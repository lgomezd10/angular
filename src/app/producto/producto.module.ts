import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosComponent } from './productos/productos.component';
import { HttpClientModule }    from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NuevoComponent } from './nuevo/nuevo.component';
import { FilterPipe } from './filter.pipe';
import { ProductosService } from './productos.service';
import { SortPipe } from './sort.pipe';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ProductoPipe } from './producto.pipe';
import { ProductoComponent } from './producto/producto.component';
import { RouterModule } from '@angular/router';
import { toolsModule } from '../tools/tools.module';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [ProductosComponent, NuevoComponent, FilterPipe, SortPipe, ProductoPipe, ProductoComponent],
  imports: [
    toolsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SocketIoModule.forRoot(config)
  ],
  exports: [
    ProductosComponent, FilterPipe, SortPipe, ProductoPipe, NuevoComponent, ProductoComponent
  ], 
  providers: [
    ProductosService
  ]
})
export class ProductoModule { }
