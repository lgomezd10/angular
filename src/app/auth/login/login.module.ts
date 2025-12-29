import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '@app/app-routing.module';

@NgModule({ declarations: [LoginComponent], imports: [FormsModule,
        ReactiveFormsModule,
        CommonModule,
        AppRoutingModule], providers: [] })
export class LoginModule { }
