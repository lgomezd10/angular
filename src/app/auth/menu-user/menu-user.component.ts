import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserResponse } from '../user';

@Component({
  selector: 'app-menu-user',
  templateUrl: './menu-user.component.html',
  styleUrls: ['./menu-user.component.css']
})
export class MenuUserComponent implements OnInit {

  isLoged: boolean = false;
  user: string;

  @ViewChild('dropdown', { static: false }) dropdown: ElementRef;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe((user:UserResponse) => {
      if (user != null) {
      this.user = user.username;
      } else {
        this.user = "";
      }
    })
    auth.isLoged().subscribe(loged => {
      this.isLoged = loged;
    })
   }

  ngOnInit(): void {
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.dropdown.nativeElement.classList.remove('is-active');
    this.auth.logout();
  }

  onClickDropdown() {
    if (this.dropdown.nativeElement.classList.contains('is-active'))
    this.dropdown.nativeElement.classList.remove('is-active');
    else 
    this.dropdown.nativeElement.classList.add('is-active');
  }

  

}
