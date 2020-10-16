import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formGroup: FormGroup;

  constructor(formBuilder: FormBuilder, private auth: AuthService) { 
    this.formGroup = formBuilder.group({
      'username': [''],
      'password': ['']
    });
  }

  ngOnInit(): void {
  }

  onLogin(): void {
    console.log("Eentrando en OnLogin", this.formGroup.value);
    
    this.auth.login(this.formGroup.value).subscribe((resp) => {
      if (resp) {        
        console.log("Se ha logado", resp);
      }
      console.log("Se ha logado");
    }, (error) => { console.log(error)});
  }

}
