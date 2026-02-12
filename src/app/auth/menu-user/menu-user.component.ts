import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserResponse } from '../user';

import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-user',
  templateUrl: './menu-user.component.html',
  styleUrls: ['./menu-user.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule]
})
export class MenuUserComponent implements OnInit {

  isLoged: boolean = false;
  user: string = '';
  loginItems: MenuItem[] = [];
  userItems: MenuItem[] = [];

  constructor(private readonly auth: AuthService, private readonly router: Router) {
    this.auth.user$.subscribe((user: UserResponse | null) => {
      if (user == null) {
        this.user = "";
        this.setUserItems();
      } else {
        this.user = user.username;
        this.setUserItems();
      }
    });
    auth.isLoged().subscribe(loged => {
      this.isLoged = loged;
    });
  }

  ngOnInit(): void {
    this.setUserItems();
    this.loginItems = [
      {
        icon: 'pi pi-sign-in',
        command: () => this.login()
      }
    ];
  }

  setUserItems() {
    this.userItems = [
      {
        label: this.user || 'Usuario',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          },
          {
            label: 'Configuración',
            icon: 'pi pi-cog',
            command: () => this.configuracion()
          }
        ]
      }
    ];
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout();
  }

  configuracion() {
    // Acción para configuración
  }
}