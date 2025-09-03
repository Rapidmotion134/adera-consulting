import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable, tap } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.isLoggedIn$.pipe(
      tap((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigate(['login']).then(()=>{return;});
        }
      })
    );
  }
}
