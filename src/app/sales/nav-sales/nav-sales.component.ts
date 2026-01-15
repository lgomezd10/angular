import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-nav-sales',
    templateUrl: './nav-sales.component.html',
    styleUrls: ['./nav-sales.component.css'],
    standalone: true,
    imports: [TabsModule, FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink]
})
export class NavSalesComponent{
  tabs = [
    { label: 'Caja', route: 'sales' },
    { label: 'Buscar ventas', route: 'sales-dates' }
  ];

  constructor() { }


}
