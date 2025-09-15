import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Page} from '../interfaces';
import {NgOptimizedImage} from '@angular/common';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatTableResponsiveModule} from '../mat-table-responsive/mat-table-responsive.module';
import {MatPaginator} from '@angular/material/paginator';
import {RouterLink} from '@angular/router';

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

  isAdmin!: boolean;
  pages!: Page[];
  displayedColumns: string[] = ['no', 'title', 'link', 'image', 'action'];
  dataSource: MatTableDataSource<Page> = new MatTableDataSource();

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.isAdmin$.subscribe((data) => {
      this.isAdmin = data;
    });
  }

}
