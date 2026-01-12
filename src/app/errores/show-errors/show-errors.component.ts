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
  conecting: boolean = true;
  isLoged: boolean = false;

  @Input() typeError: string = "Errors";

  constructor(private errorService: ErrorService, private authService: AuthService) {
    this.errorService.connectedSocket$().subscribe(connected => {
      this.withoutConexion = !connected;
      this.conecting = !connected;
      this.errorService.reset();
    });
    this.errorService.connectingSocket$().subscribe(connecting => {
      this.conecting = connecting;
    });
    this.authService.isLoged().subscribe(loged => {
      if (this.isLoged != loged && loged) {
        this.errorService.reset();
      }
      this.isLoged = loged;
    });
  }

  ngOnInit() {
    this.errores$ = this.errorService.getError$();
    this.errores404$ = this.errorService.getError404$();
    this.errores$.subscribe(val => this.erroresValue = val);
    this.errores404$.subscribe(val => this.errores404Value = val);
  }

}
