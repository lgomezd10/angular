import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RequestInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const userValue = this.auth.userValue;
        if (userValue) {
            const authReq = req.clone({
                setHeaders: {
                    auth: userValue.token
                }
            });
            return next.handle(authReq);
        }
        return next.handle(req);
    }
}