import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe, NgClass} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Document, /*Invoice, Request*/} from "../interfaces";
import {DataService} from "../data.service";
import {MatDialog} from "@angular/material/dialog";
import {DocumentDialog} from "./document-dialog";
import {ActivatedRoute, RouterLink, /*RouterLink*/} from "@angular/router";
import {MatTableResponsiveModule} from "../mat-table-responsive/mat-table-responsive.module";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {SharedService} from "../shared.service";

@Component({
  selector: 'app-documents',
  imports: [
    MatTableModule,
    ReactiveFormsModule,
    MatTableResponsiveModule,
    FormsModule,
    NgClass,
    DatePipe,
    // RouterLink,
    MatPaginatorModule,
    RouterLink,
  ],
    templateUrl: './documents.component.html',
    styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit, AfterViewInit{
  baseUrl: string = environment.baseUrl;
  filter: string = 'all';
  search: any;
	state: 0 | 1 | 2 = 0;
  isAdmin!: boolean;

  displayedColumns: string[] = ['no', 'title', 'type', 'id', 'date', 'status', 'actions'];
  userDisplayedColumns: string[] = ['no', 'title', 'type', 'id', 'date', 'status', 'actions'];
  // requestColumns: string[] = ['id', 'title', 'subject', 'date', 'status', 'actions'];
  // invoiceColumns: string[] = ['id', 'user', 'title', 'date', 'actions'];
  dataSource: MatTableDataSource<Document> = new MatTableDataSource();
  filteredDataSource: MatTableDataSource<Document> = new MatTableDataSource();
	agreements: Document[] = [];
	milestones: Document[] = [];

  dialog = inject(MatDialog);
  // requests: MatTableDataSource<Request> = new MatTableDataSource();
  // invoices: MatTableDataSource<Invoice> = new MatTableDataSource();

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,) { }

  ngOnInit(): void {
    this.dataService.isAdmin$.subscribe((data) => {
      this.isAdmin = data;
    });
    if (this.isAdmin) {
      const userId = `${this.activatedRoute.snapshot.paramMap.get('userId')}`;
      if (userId === 'null') {
        this.http.get<Document[]>(this.baseUrl + 'document')
          .subscribe((data) => {
            if (data.length) {
              this.dataSource.data = data;
              this.filteredDataSource.data = data;
            }
          });
      } else {
        this.http.get<Document[]>(this.baseUrl + `document/user/${userId}`)
          .subscribe((data) => {
            if (data.length) {
              this.dataSource.data = data;
              this.filteredDataSource.data = data;
            }
          });
      }
    } else {
      const userId = localStorage.getItem('userId');
      this.http.get<Document[]>(this.baseUrl + `document/user/${userId}`)
        .subscribe((data) => {
          if (data.length) {
            data.forEach((document) => {
							if (document.category === 'Agreement') {
								this.agreements.push(document);
							} else {
								this.milestones.push(document);
							}
						})
          }
        });
    }
  }

  @ViewChild('doc') documentPaginator!: MatPaginator;
  @ViewChild('userDoc') userDocumentPaginator!: MatPaginator;

  ngAfterViewInit() {
    if (this.isAdmin) {
      this.filteredDataSource.paginator = this.documentPaginator;
    } else {
      this.filteredDataSource.paginator = this.userDocumentPaginator;
    }
  }

  download(document: Document) {
    this.sharedService.getDownloadUrl(document.url);
    this.http.patch<Document>(`${this.baseUrl}document/update/status/${document.id}`,{})
      .subscribe((data) => {
        if (data?.id) {
          this.ngOnInit();
        }
      });
  }

  openDialog(document: Document) {
    const dialogRef = this.dialog.open(DocumentDialog, {
      data: {
        document: document,
        isDocument: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.sharedService.getDownloadUrl(document.url);
        this.http.patch<Document>(`${this.baseUrl}document/update/status/${document.id}`,{})
          .subscribe((data) => {
            if (data?.id) {
              this.ngOnInit();
            }
          });
      }
    });
  }

  onInputChange() {
    this.filteredDataSource.data = this.dataSource.filteredData.filter((data) => {
      return data?.user.firstName.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  onUserInputChange() {
    this.filteredDataSource.data = this.dataSource.filteredData.filter((data) => {
      return data?.type.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  onFilter() {
    this.filteredDataSource.data = this.dataSource.filteredData.filter((data) => {
      if (this.filter === 'all') {
        return data;
      } else if (this.filter === 'sent' && this.isAdmin) {
        return data?.isRequested === false;
      } else if (this.filter === 'received' && this.isAdmin) {
        return data?.isRequested === true;
      } else if (this.filter === 'sent' && !this.isAdmin) {
        return data?.isRequested === true;
      } else {
        return data?.isRequested === false;
      }
    });
  }
}
