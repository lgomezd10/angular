import { Component, Input, OnInit } from '@angular/core';
import { ErrorService } from '../error.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-errores',
  templateUrl: './errores.component.html',
  styleUrls: ['./errores.component.css']
})
export class ErroresComponent implements OnInit {

  errores$: Observable<string>;
  errores404$: Observable<string>;

  @Input() typeError: string = "Errors";
  

  constructor(private errorService: ErrorService) { }

  ngOnInit() {
    this.errorService.reset();
    this.errores$ = this.errorService.getError$();
    this.errores404$ = this.errorService.getError404$();
  }

}
