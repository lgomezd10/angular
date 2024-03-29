import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelecciondatesComponent } from './select-dates/select-dates.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
//import { MatFormFieldModule, MatInputModule } from '@angular/material/datepicker'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GroupByPipe } from './group-by.pipe';
import { GroupBydatePipe } from './group-by.date.pipe';
import { ButtonListComponent } from './button-list/button-list.component';
import { from } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RequestInterceptor } from './interceptors/request-interceptor';
import { ErroresModule } from '@app/errores/errors.module';

@NgModule({
  declarations: [SelecciondatesComponent, GroupByPipe, GroupBydatePipe, ButtonListComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule,
    ErroresModule
  ],
  providers: [ MatDatepickerModule, 
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' } ,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ],
  exports:[SelecciondatesComponent, GroupByPipe, GroupBydatePipe, ButtonListComponent]
})
export class ToolsModule { }
