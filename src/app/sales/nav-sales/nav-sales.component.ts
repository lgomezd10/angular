import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-nav-sales',
    templateUrl: './nav-sales.component.html',
    styleUrls: ['./nav-sales.component.css'],
    standalone: false
})
export class NavSalesComponent implements OnInit {
  tabs = [
    { label: 'Caja', route: 'sales' },
    { label: 'Buscar ventas', route: 'sales-dates' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
