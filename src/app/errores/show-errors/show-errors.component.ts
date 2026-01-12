import { Component, Input, OnInit } from '@angular/core';
import { ErrorService } from '../error.service';
import { Observable } from 'rxjs';
import { ProductsService } from '@app/product/products.service';
import { MessageModule } from 'primeng/message';
import { AuthService } from '@app/auth/auth.service';

@Component({
    selector: 'app-show-errors',
    templateUrl: './show-errors.component.html',
    styleUrls: ['./show-errors.component.css'],
    standalone: true,
    imports: [MessageModule]
})
export class ShowErrorsComponent implements OnInit {

  errores$: Observable<string>;
  errores404$: Observable<string>;
  erroresValue: string = '';
  errores404Value: string = '';
  withoutConexion: boolean = false;
  isLoged: boolean = false;

  @Input() typeError: string = "Errors";

  constructor(private errorService: ErrorService, private productsServices: ProductsService, private authService: AuthService) {
    this.productsServices.connetedServer().subscribe(connected => {
      this.withoutConexion = !connected;
      this.errorService.reset();
    });
    this.authService.isLoged().subscribe(loged => {
      this.isLoged = loged;
    });
  }

  ngOnInit() {
    this.errorService.reset();
    this.errores$ = this.errorService.getError$();
    this.errores404$ = this.errorService.getError404$();
    this.errores$.subscribe(val => this.erroresValue = val);
    this.errores404$.subscribe(val => this.errores404Value = val);
  }

}
