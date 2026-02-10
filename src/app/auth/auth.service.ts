import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserResponse } from './user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  backendUrl = environment.API_URL;
  private readonly user = new BehaviorSubject<UserResponse | null>(null);
  private readonly loged = new BehaviorSubject<boolean>(false);

  constructor(private readonly http: HttpClient, private readonly router: Router ) {
    this.checkToken();
   }

  get user$(): Observable<UserResponse | null> {
    return this.user.asObservable();
  }

  get userValue(): UserResponse | null {
    return this.user.getValue();
  }

  get token(): string {
    return this.userValue?.token || '';
  }

  isLoged(): Observable<boolean> {
    return this.loged;
  }

  login(user: User): Observable<UserResponse | void> {
    return this.http.post<UserResponse>(this.backendUrl+ '/auth/login', user).
    pipe(map((resp: UserResponse) => {
      this.saveLocalStorage(resp);
      this.user.next(resp);
      this.loged.next(true);
      this.router.navigate(['/sales']);
      return resp;
    }));
  }

  logout(): void {
    localStorage.removeItem('user');
    this.user.next(null);
    this.loged.next(false);
    this.router.navigate(['/login']);
  }

  private saveLocalStorage(user: UserResponse): void {
    const { userId, message, ...rest } = user;
    localStorage.setItem('user', JSON.stringify(rest));
  }

  checkToken() {
    let user: UserResponse | null = null;
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        user = null;
      }
    }

    if (user) {
      const isExpired = helper.isTokenExpired(user.token);
      if (isExpired) {
        this.logout();
      }
      else {
        this.user.next(user);
        this.loged.next(true);
      }
    }
  }
}
