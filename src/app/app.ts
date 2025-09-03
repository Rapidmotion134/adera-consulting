import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgClass} from "@angular/common";
import {NavComponent} from "./nav/nav.component";
import {DataService} from "./data.service";
import {Subscription} from "rxjs";
import {AuthService} from "./auth/auth.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, NgClass, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  title = 'Adera Diaspora Consulting';
  url!: string;
  subscription!: Subscription;
  adminSubscription!: Subscription;
  isAdmin!: boolean;
  isLoggedIn!: boolean;

  constructor(public router: Router,
              private dataService: DataService,
              public authService: AuthService,) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.url = this.router.url.split('?')[0].split('/')[1];
      }
    });
    this.subscription = this.authService.isLoggedIn$.subscribe((data) => {
      this.isLoggedIn = data;
    });
    this.adminSubscription = this.dataService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.adminSubscription.unsubscribe();
  }

}
