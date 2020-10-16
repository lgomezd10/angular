import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, ObservedValueOf } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {
  }
  canActivate(): Observable<boolean> {
    if (!this.auth.isLoged()) {
      this.router.navigate(['/login']);
    }
    return this.auth.isLoged();
  }

}
