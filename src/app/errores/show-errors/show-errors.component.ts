import { Component, Input, OnInit } from '@angular/core';
import { ErrorService } from '../error.service';
import { Observable } from 'rxjs';
import { ProductsService } from '@app/product/products.service';



@Component({
  selector: 'app-show-errors',
  templateUrl: './show-errors.component.html',
  styleUrls: ['./show-errors.component.css']
})
export class ShowErrorsComponent implements OnInit {

  errores$: Observable<string>;
  errores404$: Observable<string>;
  withoutConexion: boolean = false;

  @Input() typeError: string = "Errors";
  

  constructor(private errorService: ErrorService, private productsServices: ProductsService) {
    this.productsServices.connetedServer().subscribe(connected => {
      this.withoutConexion = !connected;
      this.errorService.reset();
    });
   }

  ngOnInit() {
    this.errorService.reset();
    this.errores$ = this.errorService.getError$();
    this.errores404$ = this.errorService.getError404$();
  }

}
