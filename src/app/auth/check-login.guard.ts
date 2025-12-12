import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, ObservedValueOf } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard  {
  constructor(private auth: AuthService, private router: Router) {
  }
  canActivate(): Observable<boolean> {
    return this.auth.isLoged().pipe(
      take(1),
      map((loged: boolean) => {
        if (!loged) {
          this.router.navigate(['/login']);
        }
        return loged;
      })
    )   
  }
}
