import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { CapturaErrores } from './captura-errores';
import { ErrorService } from './error.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, ShowErrorsComponent
  ],
  exports: [ShowErrorsComponent],
  providers: [
    ErrorService,
    CapturaErrores,
    { provide: ErrorHandler, useClass: CapturaErrores }
  ],
})
export class ErroresModule { }
