import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

export const checkLoginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoged().pipe(
    take(1),
    map((loged: boolean) => {
      if (!loged) {
        console.log('User not logged in, redirecting to login page');
        router.navigate(['/login']);
      }
      console.log('User logged in status:', loged);
      return loged;
    })
  );
};