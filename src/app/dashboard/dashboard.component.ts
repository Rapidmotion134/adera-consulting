import {Component, OnInit} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {DataService} from "../data.service";
import {MatMenuModule} from "@angular/material/menu";
import {Router, RouterLink} from "@angular/router";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MatTableResponsiveModule} from "../mat-table-responsive/mat-table-responsive.module";
import {MatPaginatorModule} from "@angular/material/paginator";

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
    ],
    providers: [DataService],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  constructor(private dataService: DataService,
              private http: HttpClient,
              private router: Router) { }

  baseUrl: string = environment.baseUrl;
  isAdmin!: boolean;

  ngOnInit(): void {
    this.dataService.isAdmin$.subscribe(data => {
      this.isAdmin = data;
    });
  }

}
