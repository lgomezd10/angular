import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  RouterLink, RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-nav-purchases',
    templateUrl: './nav-purchases.component.html',
    styleUrls: ['./nav-purchases.component.css'],
    standalone: true,
    imports: [TabsModule, FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink ]
})
export class NavPurchasesComponent{

  tabs = [
    { label: 'Compras', route: 'purchases' },
    { label: 'Buscar compras', route: 'purchases-dates' }
  ];

  constructor() { }


}
