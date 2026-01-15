import { Component } from '@angular/core';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css'],
  imports: [MessageModule],
  standalone: true
})
export class LogoComponent {

  nombre: string = "Nombre de tu tienda";

  constructor() { }

}
