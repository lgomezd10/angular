import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../error.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-errores',
  templateUrl: './errores.component.html',
  styleUrls: ['./errores.component.css']
})
export class ErroresComponent implements OnInit {

  errores$: Observable<string>;

  constructor(private errorService: ErrorService) { }

  ngOnInit() {
    this.errores$ = this.errorService.getError$();
  }

}