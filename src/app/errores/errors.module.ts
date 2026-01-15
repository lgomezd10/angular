import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { ErrorService } from './error.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, ShowErrorsComponent
  ],
  exports: [ShowErrorsComponent],
  providers: [
      ErrorService
  ],
})
export class ErroresModule { }
