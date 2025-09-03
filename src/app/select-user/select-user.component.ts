import {Component, OnInit} from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {User} from "../interfaces";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MatTableResponsiveModule} from "../mat-table-responsive/mat-table-responsive.module";

@Component({
    selector: 'app-select-user',
    imports: [
        MatTableModule,
        ReactiveFormsModule,
        FormsModule,
        RouterLink,
        MatTableResponsiveModule
    ],
    templateUrl: './select-user.component.html',
    styleUrl: '../users/users.component.scss'
})
export class SelectUserComponent implements OnInit{

  selectFor!: string;
  baseUrl: string = environment.baseUrl;
  search!: string;

  displayedColumns: string[] = ['id', 'name', 'phone', 'bought', 'regDate', 'action'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  filteredDataSource: MatTableDataSource<User> = new MatTableDataSource();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient) { }

  ngOnInit(): void {
    switch (this.route.snapshot.url[0].path) {
      case 'document':
        this.selectFor = 'document';
        break;
      case 'invoice':
        this.selectFor = 'invoice';
        break;
      default:
        this.selectFor = 'request';
        break;
    }
    this.http.get<User[]>(this.baseUrl + `user`)
      .subscribe((data) => {
        if (data.length) {
          let temp = data.filter((user) => {
            return !user.isAdmin;
          })
          this.dataSource = new MatTableDataSource(temp);
          this.filteredDataSource = this.dataSource;
        }
      });
  }

  onInputChange() {
    let temp = this.dataSource.filteredData.filter((data) => {
      return data?.firstName.toLowerCase().includes(this.search.toLowerCase());
    })
    this.filteredDataSource = new MatTableDataSource<User>(temp);
  }
}
