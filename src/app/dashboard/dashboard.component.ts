import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {DataService} from "../data.service";
import {MatMenuModule} from "@angular/material/menu";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {environment} from "../../environments/environment";
import {MatTableResponsiveModule} from "../mat-table-responsive/mat-table-responsive.module";
import {MatPaginatorModule} from "@angular/material/paginator";
import * as jose from 'jose';
import {AuthService} from '../auth/auth.service';
import {NgOptimizedImage} from '@angular/common';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent} from '@angular/material/dialog';

@Component({
    selector: 'app-dashboard',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatMenuModule,
    RouterLink,
    MatTableResponsiveModule,
    MatPaginatorModule,
    NgOptimizedImage,
  ],
    providers: [DataService],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  baseUrl: string = environment.baseUrl;
  isAdmin!: boolean;
  isNew!: boolean;
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.dataService.isAdmin$.subscribe(data => {
      this.isAdmin = data;
    });
    this.route.queryParams.subscribe((params) => {
      const token: string = params['token'];
      this.isNew = params['new'];
      if (token) {
        localStorage.setItem("access_token", token);
        this.authService.setLoginStatus(true);
        const decoded = jose.decodeJwt(token);
        if (decoded.sub) {
          localStorage.setItem('userId', <string>decoded["userId"]);
          localStorage.setItem('username', <string>decoded.sub);
          localStorage.setItem('isSuper', 'false');
          this.dataService.setIsAdmin(<boolean>decoded['isAdmin']);
        }
      }
    });
    if (this.isNew) {
      this.dialog.open(WelcomeDialogComponent);
    }
  }
}

@Component({
  selector: 'welcome-dialog',
  templateUrl: 'welcome-dialog.html',
  styleUrls: ['./welcome-dialog.scss'],
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeDialogComponent { }
