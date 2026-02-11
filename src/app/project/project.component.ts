import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource, MatTableModule
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableResponsiveModule} from '../mat-table-responsive/mat-table-responsive.module';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {environment} from '../../environments/environment';
import {Document, Project} from '../interfaces';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../data.service';
import {SharedService} from '../shared.service';
import {DocumentDialog} from '../documents/document-dialog';

@Component({
  selector: 'app-project',
  imports: [
    DatePipe,
    FormsModule,
    MatTableModule,
    MatTableResponsiveModule,
    RouterLink,
    MatPaginator,
    TitleCasePipe
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit, AfterViewInit {

  baseUrl: string = environment.baseUrl;
  search: any;
  isAdmin!: boolean;
  isSuperAdmin: boolean = JSON.parse(`${localStorage.getItem('isSuper')}`);

  displayedColumns: string[] = ['no', 'title', 'user', 'admin', 'start-date', 'due-date', 'actions'];
  dataSource: MatTableDataSource<Project> = new MatTableDataSource();
  filteredDataSource: MatTableDataSource<Project> = new MatTableDataSource();

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.dataService.isAdmin$.subscribe((data) => {
      this.isAdmin = data;
    });
    if (this.isSuperAdmin) {
      const userId = `${this.activatedRoute.snapshot.paramMap.get('userId')}`;
      if (userId === 'null') {
        this.http.get<Project[]>(this.baseUrl + 'project')
          .subscribe((data) => {
            if (data.length) {
              this.dataSource.data = data;
              this.filteredDataSource.data = data;
            }
          });
      }
    } else if (!this.isSuperAdmin && this.isAdmin) {
      const userId = `${this.activatedRoute.snapshot.paramMap.get('userId')}`;
      if (userId === 'null') {
        this.http.get<Project[]>(this.baseUrl + 'project/admin')
          .subscribe((data) => {
            if (data.length) {
              this.dataSource.data = data;
              this.filteredDataSource.data = data;
            }
          });
      }
    } else {
      const userId = localStorage.getItem('userId');
      this.http.get<Project[]>(this.baseUrl + `project/user/${userId}`)
        .subscribe((data) => {
          if (data.length) {
            this.dataSource.data = data;
            this.filteredDataSource.data = data;
          }
        });
    }
  }

  @ViewChild('paginator') paginator!: MatPaginator;

  ngAfterViewInit() {
    this.filteredDataSource.paginator = this.paginator;
  }

  onInputChange() {
    this.filteredDataSource.data = this.dataSource.filteredData.filter((data) => {
      return data?.user.firstName.toLowerCase().includes(this.search.toLowerCase());
    });
  }

}
