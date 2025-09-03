import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable} from 'rxjs';
import { AuthService} from "./auth.service";
import { first, mergeMap} from "rxjs/operators";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.endsWith('login')){
      return next.handle(req);
    }
    return this.authService.getAuthorizationToken().pipe(
      first(),
      mergeMap((token) => {
        const authReq = req.clone({
          headers: req.headers.set('authorization', `Bearer ${token}`)
        });
        // send cloned request with header to the next handler.
        return next.handle(authReq);
      }));
  }
}
