import { Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormErrors } from '@app/tools/form-errors';
import { AuthService } from '../auth.service';
import { MessageModule } from 'primeng/message';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    imports: [ReactiveFormsModule, MessageModule],
    standalone: true
})
export class LoginComponent {

  formGroup: UntypedFormGroup;
  hide: boolean = true;
  event$: KeyboardEvent;
  authErrorMessage: string = '';

  @ViewChild('password') password: ElementRef;
  @ViewChild('icon') icon: ElementRef;

  constructor(formBuilder: UntypedFormBuilder, private readonly auth: AuthService) {
    this.formGroup = formBuilder.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }


  onLogin(): void {
    if (this.formGroup.valid) {
      this.auth.login(this.formGroup.value).subscribe({
        next: (resp) => {
        if (resp) {
          console.log("Logged user");
        }
      },
        error: (error) => {
          console.error('Login error:', error);
          this.authErrorMessage = 'El usuario o la contraseña no son válidos'; } 
      });
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
