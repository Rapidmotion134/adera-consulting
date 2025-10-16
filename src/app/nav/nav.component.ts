import {AfterViewInit, Component, inject, Input, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatDivider} from "@angular/material/divider";
import {NgOptimizedImage, TitleCasePipe} from "@angular/common";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Notification} from "../interfaces";
import {MatDialog} from "@angular/material/dialog";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatBadge} from '@angular/material/badge';
import {DocumentDialog} from '../documents/document-dialog';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.scss',
    imports: [MatButtonModule, MatMenuModule, MatDivider, MatBadge, TitleCasePipe, RouterLink, NgOptimizedImage],
    animations: [
        trigger('detailExpand', [
            state('opened', style({ visibility: 'visible', opacity: 1 })),
            state('closed', style({ visibility: 'hidden', opacity: 0 })),
            transition('opened <=> closed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class NavComponent implements OnInit, AfterViewInit {

  username: string = `${localStorage.getItem('username')}`;

  constructor(
    public router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  @Input() isAdmin!: boolean;
  page!: string;
  baseUrl: string = environment.baseUrl;
  userId: string = `${localStorage.getItem('userId')}`;
  notifications: Notification[] = [];
  document!: Document;
  dialog = inject(MatDialog);
  isNavOpen: boolean = false;
  navbar: HTMLElement | null = null;

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url.split('?')[0].substring(1).split('/')[0];
         if (url === 'dashboard') {
           this.page = "Dashboard";
         } else if (url === 'notifications') {
           this.page = "Notification";
         } else if (url === 'documents') {
           this.page = this.router.url.split('?')[0].substring(1).split('/')[0].replace('-', ' ');
         } else {
             this.page = this.router.url.split('?')[0].substring(1).split('/')[0];
         }
      }
    });
    this.http.get<Notification[]>(this.baseUrl + `notification/user/unread/${(this.userId)}`)
      .subscribe((data) => {
        if (data.length) {
          data.sort((a, b) => {
            if (a.date > b.date) return -1;
            if (a.date < b.date) return 1;
            return 0;
          });
          this.notifications = data;
        }
      });
  }

  ngAfterViewInit() {
    this.navbar = document.querySelector(".navigation");
    this.username = `${localStorage.getItem('username')}`;
  }

  logOut() {
    localStorage.removeItem('access_token');
    this.authService.logOut();
    this.router.navigate(['login']).then(() => {return;})
  }

  openDialog(documentId: number) {
    if (!this.document) {
      this.http.get<Document>(this.baseUrl + `document/${documentId}`)
        .subscribe((data) => {
          if (data) {
            this.document = data;
            this.dialog.open(DocumentDialog, {
              data: { document: this.document },
              minWidth: 700,
            });
          }
        });
    } else {
      this.dialog.open(DocumentDialog, {
        data: { document: this.document },
        minWidth: 700
      });
    }
  }

  viewNotification(notification: Notification, index: number) {
    switch (notification.title) {
      case 'New Document Received':
        this.openDialog(notification.item);
        break;
      case 'New User':
        this.router.navigate(['/','users', 'view', notification.item])
          .then(() => {return;})
        break;
      case 'Payment Received':
        break;
    }
    this.http.patch(this.baseUrl + `notification/${notification.id}`, {})
      .subscribe();
    this.notifications.splice(index, 1);
  }

  toggleNavbar() {
    this.isNavOpen = !this.isNavOpen;
    this.navbar?.classList.toggle("open");
  }
}
