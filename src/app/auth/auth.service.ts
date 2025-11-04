import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import * as jose from 'jose'

@Injectable({ providedIn: 'root' })
export class AuthService {
  baseUrl: string = environment.baseUrl;

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$= this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('access_token');
    if (token) {
      if (this.isTokenExpired(token)){
        this._isLoggedIn$.next(false);
        localStorage.removeItem("access_token");
      } else {
        this._isLoggedIn$.next(true);
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.baseUrl + 'auth/login', {
      email, password
    }).pipe(
      catchError((err) => {
        console.error(err);
        return of(false);
      }),
      tap((response: any): void => {
        if (response) {
          this.setUserInfo(response["access_token"]);
        } else {
          return response;
        }
      })
    )
  }

  setUserInfo (access_token: string) {
    localStorage.setItem("access_token", access_token);
    this._isLoggedIn$.next(true);
    const decoded = jose.decodeJwt(access_token);
    if (decoded.sub) {
      localStorage.setItem('userId', <string>decoded["userId"]);
      localStorage.setItem('username', <string>decoded.sub);
      localStorage.setItem('isSuper', <string>decoded['isSuperAdmin']);
      localStorage.setItem('adminType', <string>decoded['adminType']);
    }
  }

  logOut () {
    this._isLoggedIn$.next(false);
  }

  getAuthorizationToken(): Observable<string | null> {
    const token = localStorage.getItem('access_token');
    if (token) {
      if (this.isTokenExpired(token)){
        this._isLoggedIn$.next(false);
        localStorage.removeItem("access_token");
        return of(null);
      } else {
        this._isLoggedIn$.next(true);
        return of(token);
      }
    } else {
      this._isLoggedIn$.next(false);
      return of(null);
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decodedToken = jose.decodeJwt(token);
      if (!decodedToken.exp) {
        return true;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime >= decodedToken.exp;
    } catch (error: any) {
      console.error('Error decoding token:', error.message);
      return true;
    }
  }

  setLoginStatus(status: boolean) {
    this._isLoggedIn$.next(status);
  }
}
