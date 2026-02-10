import { Component, Input, EventEmitter, Output} from '@angular/core';
import { ButtonType } from '../button-type';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-button-list',
    templateUrl: './button-list.component.html',
    styleUrls: ['./button-list.component.css'],
    standalone: true,
    imports: [MenuModule, ButtonModule]
})
export class ButtonListComponent {

  @Input() lista: ButtonType[] = [];

  @Output()
  sendButtonType = new EventEmitter<string>();

  menuItems: MenuItem[] = [];

  constructor() {}

  processKeydown(key: KeyboardEvent, idButtonType: string) {
    if (key.code == "ArrowUp" || key.code == "ArrowDown" || key.code == "ArrowLeft" || key.code == "ArrowRight") {
      key.preventDefault();
      const visibleButtons = this.lista.filter(b => b.show);
      let currentIndex = visibleButtons.findIndex(boton => boton.id == idButtonType);
      let nextIndex: number;
      if (key.code == "ArrowUp" || key.code == "ArrowLeft") {
        nextIndex = (currentIndex - 1 + visibleButtons.length) % visibleButtons.length;
      } else {
        nextIndex = (currentIndex + 1) % visibleButtons.length;
      }
      
      // Cambia el foco al siguiente botón sin emitir evento
      this.lista = this.lista.map(b => ({
        ...b,
        focused: b.id === visibleButtons[nextIndex].id
      }));
    }
  }

  onSend(button: string) {
    this.sendButtonType.emit(button);
  }

}
