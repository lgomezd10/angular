import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ProductModule } from './product/product.module';
import { HttpClientModule } from '@angular/common/http';
import { SalesModule } from './sales/sales.module';
import { LogoComponent } from './logo/logo.component';
import { PurchasesModule } from './purchases/purchases.module';
import { ErroresModule } from './errores/errors.module';
import { ToolsModule } from './tools/tools.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuUserComponent } from './auth/menu-user/menu-user.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './auth/login/login.module';



@NgModule({
  declarations: [
    AppComponent,
    LogoComponent,
    MenuUserComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    ProductModule,
    SalesModule,
    PurchasesModule,
    LoginModule,
    ErroresModule,
    ToolsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule

  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
