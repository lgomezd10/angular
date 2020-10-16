import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TU TIENDA DE ALIMENTACION';

  @ViewChild('navMenu', { static: false }) navMenu: ElementRef;
  @ViewChild('buttoOculto', { static: false }) buttoOculto: ElementRef;

  constructor(private auth: AuthService) {}

  onLogout() {
    console.log(" Se va a deslogar");
    this.auth.logout();
  }

  onClickBurger() {
    //this.dropdown.nativeElement.classList.remove('is-active');
    if (this.buttoOculto.nativeElement.classList.contains('is-active')) {
      this.buttoOculto.nativeElement.classList.remove('is-active');
    this.navMenu.nativeElement.classList.remove('is-active');      
    } else {
      this.buttoOculto.nativeElement.classList.add('is-active');
      this.navMenu.nativeElement.classList.add('is-active');
    }
    

  }
}
