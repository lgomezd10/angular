import { Component, OnInit, Input, EventEmitter, Output, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Boton } from '../boton';
import { HerramientasService } from '../herramientas.service';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, tap, map, delay } from 'rxjs/operators';

@Component({
  selector: 'app-lista-botones',
  templateUrl: './lista-botones.component.html',
  styleUrls: ['./lista-botones.component.scss']
})
export class ListaBotonesComponent implements OnInit {

  @Input() lista: Boton[] = [];

  @Output()
  enviarBoton = new EventEmitter<string>();
  @ViewChildren('listButton') buttons: QueryList<ElementRef>;

  listaBotones$: Observable<Boton[]>;
  foco$: Observable<string>;

  viewUpdated$: Observable<any>;

  _focoSub: Subscription;

  constructor(private herramientasServices: HerramientasService) {

  }

  ngOnInit() {
    this.herramientasServices.crearBotones(this.lista);
    this.listaBotones$ = this.herramientasServices.getBotones$();
    this.foco$ = this.herramientasServices.getFoco$();

    this.viewUpdated$ = combineLatest(this.foco$, this.listaBotones$)

    this._focoSub = this.foco$
    .pipe(      
      filter((boton) => boton !== null),
      filter((boton) => boton !== ""),
      delay(1),
      tap((boton) => console.log(`El valor del botón es: ${boton}`))
    )
    .subscribe(boton => {        
        this.buttons.forEach((button: ElementRef) => {
          if (button.nativeElement.id === boton ){
            button.nativeElement.focus();
          }
        });
        /*if(document.getElementById(boton) != null)
          document.getElementById(boton).focus();      */
    });


  }

  onEnviar(boton: string) {
    this.enviarBoton.emit(boton);
    this.herramientasServices.pulsarBoton(boton);
  }

  ngOnDestroy() {    
    this._focoSub.unsubscribe();
  }

}
