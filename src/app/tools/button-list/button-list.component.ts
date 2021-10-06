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
    this.buttonList$ = this.toolsServices.getButtonTypes$();
    this.foco$ = this.toolsServices.getFoco$();

    this.viewUpdated$ = combineLatest(this.foco$, this.buttonList$)

    //TODO mirar si se puede evitar el delay
    this._focoSub = this.foco$
      .pipe(
        filter((button) => button !== null),
        filter((button) => button !== ""),
        delay(1),
        tap((button) => console.log(`El valor del botón es: ${button}`))
      )
      .subscribe(b => {
        this.buttons.forEach((button: ElementRef) => {
          if (button.nativeElement.id === b) {
            button.nativeElement.focus();
          }
        });
        /*if(document.getElementById(button) != null)
          document.getElementById(button).focus();      */
      });

  }

  processKeydown(key: KeyboardEvent, idButtonType: string) {
    
    if (key.code == "ArrowUp" || key.code == "ArrowDown") { // key up || key down
           
      let active: string = idButtonType;
      let buttons: ButtonType[] = this.toolsServices.getButtonTypes().filter((button:ButtonType )=> button.show);
      let index = buttons.indexOf(buttons.find(button => button.id == idButtonType));
      if (index < buttons.length - 1 && key.code == "ArrowDown") {
        active = buttons[index + 1].id;        
      }
      if (index > 0 && key.code == "ArrowUp") {
        active = buttons[index - 1].id;
      } 
      if (active != idButtonType) {
        this.buttons.forEach((button: ElementRef) => {
          if (button.nativeElement.id == active) {
            button.nativeElement.focus();
          }
        });
      }
    }
  }

  onSend(button: string) {
    this.sendButtonType.emit(button);
    this.toolsServices.pushButtonType(button);
  }

  ngOnDestroy() {
    this._focoSub.unsubscribe();
  }

}
