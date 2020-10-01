import { Component, OnInit, Input, EventEmitter, Output, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ButtonType } from '../button-type';
import { ToolsService } from '../tools.service';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, tap, map, delay } from 'rxjs/operators';

@Component({
  selector: 'app-button-list',
  templateUrl: './button-list.component.html',
  styleUrls: ['./button-list.component.scss']
})
export class ButtonListComponent implements OnInit {

  @Input() lista: ButtonType[] = [];

  @Output()
  sendButtonType = new EventEmitter<string>();
  @ViewChildren('listButton') buttons: QueryList<ElementRef>;

  buttonList$: Observable<ButtonType[]>;
  foco$: Observable<string>;

  viewUpdated$: Observable<any>;

  _focoSub: Subscription;

  constructor(private toolsServices: ToolsService) {

  }

  ngOnInit() {
    this.toolsServices.crearButtonTypees(this.lista);
    this.buttonList$ = this.toolsServices.getButtonTypees$();
    this.foco$ = this.toolsServices.getFoco$();

    this.viewUpdated$ = combineLatest(this.foco$, this.buttonList$)

    this._focoSub = this.foco$
      .pipe(
        filter((boton) => boton !== null),
        filter((boton) => boton !== ""),
        delay(1),
        tap((boton) => console.log(`El valor del botón es: ${boton}`))
      )
      .subscribe(boton => {
        this.buttons.forEach((button: ElementRef) => {
          if (button.nativeElement.id === boton) {
            button.nativeElement.focus();
          }
        });
        /*if(document.getElementById(boton) != null)
          document.getElementById(boton).focus();      */
      });

  }

  procesarKeydown(key: KeyboardEvent, idButtonType: string) {
    console.log(`se va a procesa la tecla ${key} para el campo ${idButtonType}`);
    
    if (key.keyCode == 38 || key.keyCode == 40) { // key up || key down
           
      let idActivar: string = idButtonType;
      let botones: ButtonType[] = this.toolsServices.getButtonTypees().filter((button:ButtonType )=> button.show);
      let index = botones.indexOf(botones.find(button => button.id == idButtonType));
      if (index < botones.length - 1 && key.keyCode == 40) {
        idActivar = botones[index + 1].id;        
      }
      if (index > 0 && key.keyCode == 38) {
        idActivar = botones[index - 1].id;
      } 
      if (idActivar != idButtonType) {
        this.buttons.forEach((button: ElementRef) => {
          if (button.nativeElement.id == idActivar) {
            button.nativeElement.focus();
          }
        });
      }
    }
  }

  onSend(boton: string) {
    this.sendButtonType.emit(boton);
    this.toolsServices.pulsarButtonType(boton);
  }

  ngOnDestroy() {
    this._focoSub.unsubscribe();
  }

}
