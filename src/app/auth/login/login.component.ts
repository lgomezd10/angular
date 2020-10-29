import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;
  hide: boolean;

  @ViewChild('password') password: ElementRef;
  @ViewChild('icon') icon: ElementRef;

  constructor(formBuilder: FormBuilder, private auth: AuthService) {
    this.formGroup = formBuilder.group({
      'username': [''],
      'password': ['']
    });
  }

  ngOnInit(): void {
  }

  onLogin(): void {

    this.auth.login(this.formGroup.value).subscribe((resp) => {
      if (resp) {
        console.log("Se ha logado", resp);
      }

    }, (error) => { console.log(error) });
  }

  showPassword() {
    if (this.icon.nativeElement.classList.contains("fa-eye-slash")) {
      this.password.nativeElement.setAttribute("type", "password");
      this.icon.nativeElement.setAttribute("class", "fas fa-eye");
    } else {
      this.password.nativeElement.setAttribute("type", "text");
      this.icon.nativeElement.setAttribute("class", "fas fa-eye-slash");
    }
  }

}
