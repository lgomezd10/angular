import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NewComponent } from './new/new.component';
import { FilterPipe } from './filter.pipe';
import { ProductsService } from './products.service';
import { SortPipe } from './sort.pipe';

import { ProductPipe } from './product.pipe';
import { ProductComponent } from './product/product.component';
import { RouterModule } from '@angular/router';
import { ToolsModule } from '../tools/tools.module';

@NgModule({
    declarations: [],
    exports: [],
    imports: [ToolsModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
    providers: [
        ProductsService,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class ProductModule { }
