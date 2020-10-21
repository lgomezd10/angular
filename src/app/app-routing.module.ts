import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product/product.component';
import { NavSalesComponent } from './sales/nav-sales/nav-sales.component';
import { SalesComponent } from './sales/sales/sales.component';
import { ErroresComponent } from './errores/errores/errores.component';
import { LogoComponent } from './logo/logo.component';
import { ProductsComponent } from './product/products/products.component';
import { PurchasesComponent } from './purchases/purchases/purchases.component';
import { SalesDateComponent } from './sales/sales-date/sales-date.component';
import { LoginComponent } from './auth/login/login.component';
import { NavPurchasesComponent } from './purchases/nav-purchases/nav-purchases.component';
import { PurchasesDateComponent } from './purchases/purchases-date/purchases-date.component';
import { CheckLoginGuard } from './auth/check-login.guard';

const routes: Routes = [
  {
    path: '',
    component: NavSalesComponent
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'sales',
    component: NavSalesComponent,
    canActivate: [CheckLoginGuard],
    children: [
      {
        path: 'sales', redirectTo: '', pathMatch: "full"
      },
      {
        path: '', // child route path
        component: SalesComponent, // child route component that the router renders
      },
      {
        path: 'sales-dates',
        component: SalesDateComponent, // another child route component that the router renders
      }
    ]
  },

  {
    path: 'purchases',
    component: NavPurchasesComponent,
    canActivate: [CheckLoginGuard],
    children: [
      {
        path: 'purchases', redirectTo: '', pathMatch: "full"
      },
      {
        path: '', component: PurchasesComponent
      },
      {
        path: 'purchases-dates', component: PurchasesDateComponent
      }
    ]

  },
  {
    path: 'error',
    component: ErroresComponent
  },
  {
    path: 'product/:id',
    component: ProductComponent,
    canActivate: [CheckLoginGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { enableTracing: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
