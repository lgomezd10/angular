import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/auth/auth.service';
import { ErrorService } from '@app/errores/error.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class RequestInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService, private errorSrv: ErrorService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {        
        const userValue = this.auth.userValue;
        this.errorSrv.reset();
        //debugger;
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