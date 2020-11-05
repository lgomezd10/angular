import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from '@app/tools/form-errors';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;
  hide: boolean = true;

  @ViewChild('password') password: ElementRef;
  @ViewChild('icon') icon: ElementRef;

  constructor(formBuilder: FormBuilder, private auth: AuthService) {
    this.formGroup = formBuilder.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit(): void {
  }

  onLogin(): void {
    if (this.formGroup.valid) {
      this.auth.login(this.formGroup.value).subscribe((resp) => {
        if (resp) {
          console.log("Se ha logado", resp);
        }

      }, (error) => { console.log(error) });
    }
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

  onEnter(key: KeyboardEvent, field: HTMLElement) {
    console.log("El keycode", key);
    if (key.code == "Enter") {
      if (field) {
        field.focus();
      }
    }
  }

  checkError(field: string): boolean {
    return FormErrors.checkError(field, this.formGroup)
  }

  getError(name: string, field: string): string {
    return FormErrors.getError(name, field, this.formGroup);
  }

}
