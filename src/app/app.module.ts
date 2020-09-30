import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ProductModule } from './product/product.module';
import { HttpClientModule } from '@angular/common/http';
import { SalesModule } from './sales/sales.module';
import { LogoComponent } from './logo/logo.component';
import { SalesComponent } from './sales/sales/sales.component';
import { ProductsComponent } from './product/products/products.component';
import { PurchasesComponent } from './purchases/purchases/purchases.component';
import { purchasesModule } from './purchases/purchases.module';
import { ErroresComponent } from './errores/errores/errores.component';
import { ErroresModule } from './errores/errores.module';
import { ToolsModule } from './tools/tools.module';
import { ProductComponent } from './product/product/product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
library.add(fas);

const appRoutes: Routes = [
  {
    path: '',
    component: SalesComponent
  },
  {
    path: 'sales',
    component: SalesComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'purchases',
    component: PurchasesComponent
  },
  {
    path: 'error',
    component: ErroresComponent
  },
  {
    path: 'product/:productId',
    component: ProductComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LogoComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    ProductModule,
    SalesModule,
    purchasesModule,
    ErroresModule,
    ToolsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    BrowserAnimationsModule,
    FontAwesomeModule

  ],
  exports: [FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
