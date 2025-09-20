import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {User} from "../interfaces";
import {environment} from "../../environments/environment";
import {MatTableResponsiveModule} from "../mat-table-responsive/mat-table-responsive.module";
import {NgIf} from "@angular/common";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";

@Component({
    selector: 'app-users',
    imports: [
        MatTableModule,
        ReactiveFormsModule,
        FormsModule,
        RouterLink,
        MatTableResponsiveModule,
        MatPaginatorModule
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, AfterViewInit {

  baseUrl: string = environment.baseUrl;
  search!: string;
  isSuperAdmin: boolean = JSON.parse(`${localStorage.getItem('isSuper')}`);
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  adminDataSource: MatTableDataSource<User> = new MatTableDataSource();
  filteredDataSource: MatTableDataSource<User> = new MatTableDataSource();
  displayedColumns: string[] = ['id', 'name', 'phone', 'email', 'regDate', 'actions', /*'more'*/];
  displayedAdminColumns: string[] = ['id', 'name', 'phone', 'regDate', 'actions', /*'more'*/];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<User[]>(this.baseUrl + `user`)
      .subscribe((data) => {
        if (data.length) {
          data.sort((a, b) => {
            if (a.registrationDate > b.registrationDate) return -1;
            if (a.registrationDate < b.registrationDate) return 1;
            return 0;
          });
          this.dataSource.data = data;
          this.filteredDataSource.data = data;
        }
      });
    if (this.isSuperAdmin) {
      this.http.get<User[]>(this.baseUrl + `user/admins`)
        .subscribe((data) => {
          if (data) {
            this.adminDataSource.data = data;
          }
        });
    }
  }

  @ViewChild('admin') adminPaginator!: MatPaginator;
  @ViewChild('user') userPaginator!: MatPaginator;

  ngAfterViewInit() {
    this.adminDataSource.paginator = this.adminPaginator;
    this.filteredDataSource.paginator = this.userPaginator;
  }

  onInputChange() {
    this.filteredDataSource.data = this.dataSource.filteredData.filter((data) => {
      return data?.firstName.toLowerCase().includes(this.search.toLowerCase());
    });
  }
}
