import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {DataService} from "../data.service";
import {MatMenuModule} from "@angular/material/menu";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {environment} from "../../environments/environment";
import {MatTableResponsiveModule} from "../mat-table-responsive/mat-table-responsive.module";
import {MatPaginatorModule} from "@angular/material/paginator";
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
							private router: Router) { }

  baseUrl: string = environment.baseUrl;
  isAdmin!: boolean;
  adminType!: string;
  isNew!: boolean;
  readonly dialog = inject(MatDialog);
	userId!: string;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.isNew = params['new'];
    });
    if (this.isNew) {
      this.openDialog();
    } else {
      this.dataService.isAdmin$.subscribe(data => {
        this.isAdmin = data;
      });
      this.dataService.adminType$.subscribe(data => {
        this.adminType = data;
      });
    }
  }

  openDialog() {
		const dialogRef = this.dialog.open(WelcomeDialogComponent);
		dialogRef.afterClosed().subscribe(() => {
			this.router.navigate(['/', 'registration']).then(()=> {return;});
		});
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
