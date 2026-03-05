import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableResponsiveModule} from '../mat-table-responsive/mat-table-responsive.module';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {environment} from '../../environments/environment';
import {Project} from '../interfaces';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../data.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialog} from '../view-user/confirmation-dialog';

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
  standalone: true,
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit, AfterViewInit {

  baseUrl: string = environment.baseUrl;
  search: any;
  isAdmin!: boolean;
  isSuperAdmin: boolean = JSON.parse(`${localStorage.getItem('isSuper')}`);
  dialog = inject(MatDialog);

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

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      minWidth: 700,
      data: {
        isUser: false
      }
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.http.delete(this.baseUrl + `project/${project.id}`)
          .subscribe((data) => {
            if (data) {
              this.dataSource.data = this.dataSource.data.filter(
                p => p.id !== project.id
              );
              this.filteredDataSource.data = this.dataSource.data;
            }
          });
      }
    });
  }

}
