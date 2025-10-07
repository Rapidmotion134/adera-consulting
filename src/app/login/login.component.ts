import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import * as jose from 'jose';
import {Subscription} from "rxjs";
import {DataService} from "../data.service";
import {NgOptimizedImage} from '@angular/common';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgOptimizedImage],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit, OnDestroy{
  email!: string;
  password!: string;
  subscription!: Subscription;
  error: boolean = false;
  type: "password" | "text" = "password";
  googleUrl: string = environment.baseUrl + "auth/google";

  constructor(private authService: AuthService,
              private router: Router,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.subscription = this.authService.isLoggedIn$.subscribe((data => {
      if (data) {
        let token = localStorage.getItem('access_token');
        if (token) {
          const decoded = jose.decodeJwt(token);
          this.dataService.setIsAdmin(<boolean>decoded['isAdmin']);
        }
      }
    }));
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  changeVisibility() {
    this.type === "password" ? this.type = "text" : this.type = "password";
  }

  login() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password)
        .subscribe((data) => {
          if (data) {
            const decoded = jose.decodeJwt(data['access_token']);
            this.dataService.setIsAdmin(<boolean>decoded['isAdmin']);
            this.router.navigate([`/`, `dashboard`]).then(()=> {return;});
          } else {
            this.error = true;
          }
        });
    }
  }
}
