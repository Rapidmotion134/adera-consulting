import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Page} from '../interfaces';
import {NgOptimizedImage} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatTableResponsiveModule} from '../mat-table-responsive/mat-table-responsive.module';
import {MatPaginator} from '@angular/material/paginator';
import {Router, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-pages',
  imports: [
    NgOptimizedImage,
    MatTableModule,
    MatTableResponsiveModule,
    MatPaginator,
    RouterLink,
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit {

  baseUrl: string = environment.baseUrl;
  isAdmin!: boolean;
  services: Page[] = [];
  appointments: Page[] = [];
  supports: Page[] = [];
  state: 0 | 1 | 2 | 3 = 0;
  displayedColumns: string[] = ['no', 'title', 'link', 'image', 'category', 'action'];
  dataSource: MatTableDataSource<Page> = new MatTableDataSource();

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataService.isAdmin$.subscribe((data) => {
      this.isAdmin = data;
    });
    this.http.get<Page[]>(this.baseUrl + `page`)
      .subscribe((data) => {
        if (data && data.length > 0) {
          this.dataSource = new MatTableDataSource(data);
					data.forEach((page) => {
						switch (page.category) {
							case 'Service Request':
								this.services.push(page);
								break;
							case 'Appointment Request':
								this.appointments.push(page);
								break;
							default:
								this.supports.push(page);
								break;
						}
					})
        }
      })
  }

  editPage(page: Page) {
    localStorage.setItem('page', JSON.stringify(page));
    this.router.navigate(['/', 'requests', 'edit']).then(()=> {return;});
  }

  protected readonly window = window;
}
