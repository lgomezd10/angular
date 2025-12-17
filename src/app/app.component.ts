import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from './auth/auth.service';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './logo/logo.component';
import { MenuUserComponent } from './auth/menu-user/menu-user.component';
import { ShowErrorsComponent } from './errores/show-errors/show-errors.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LogoComponent, MenuUserComponent, ShowErrorsComponent]
})
export class AppComponent {
  title = 'TU TIENDA DE ALIMENTACION';

  @ViewChild('navMenu', { static: false }) navMenu: ElementRef;
  @ViewChild('buttoOculto', { static: false }) buttoOculto: ElementRef;

  constructor(private auth: AuthService) {
    console.log('AppComponent loaded');
  }

  onLogout() {
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
