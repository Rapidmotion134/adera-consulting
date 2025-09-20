import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Document, Notification} from "../interfaces";
import {environment} from "../../environments/environment";
import {DocumentDialog} from "../documents/document-dialog";
import {MatDialog} from "@angular/material/dialog";
import {DataService} from "../data.service";
import {MatTableResponsiveModule} from "../mat-table-responsive/mat-table-responsive.module";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {SharedService} from "../shared.service";

@Component({
    selector: 'app-notifications',
    imports: [MatTableModule, ReactiveFormsModule, FormsModule, DatePipe, MatTableResponsiveModule, MatPaginatorModule],
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit, AfterViewInit {
  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private router: Router,
    private sharedService: SharedService
  ) { }

  baseUrl: string = environment.baseUrl;
  filter: string = 'all';
  dialog = inject(MatDialog);
  document!: Document;
  isAdmin!: boolean;

  displayedColumns: string[] = ['icon', 'title', 'description', 'date', 'actions'];
  dataSource: MatTableDataSource<Notification> = new MatTableDataSource();
  filteredDataSource: MatTableDataSource<Notification> = new MatTableDataSource();

  ngOnInit(): void {
    this.dataService.isAdmin$.subscribe(data => {
      this.isAdmin = data;
    });
    const userId = localStorage.getItem("userId");
    this.http.get<Notification[]>(this.baseUrl + `notification/user/${userId}`)
      .subscribe((data) => {
        if (data.length) {
          data.sort((a, b) => {
            if (a.date > b.date) return -1;
            if (a.date < b.date) return 1;
            return 0;
          });
          this.dataSource.data = data;
        }
      })
  }

  @ViewChild('paginator') paginator!: MatPaginator;

  ngAfterViewInit() {
    this.filteredDataSource.paginator = this.paginator;
  }

  openDialog(documentId: number) {
    this.http.get<Document>(this.baseUrl + `document/${documentId}`)
      .subscribe((data) => {
        if (data) {
          this.document = data;
          const dialogRef = this.dialog.open(DocumentDialog, {
            data: {
              document: this.document,
            },
            minWidth: 700
          });

          dialogRef.afterClosed().subscribe((result: Boolean) => {
            if (result) {
              this.sharedService.getDownloadUrl(this.document.url);
              this.http.patch<Document>(`${this.baseUrl}document/update/status/${this.document.id}`,{})
                .subscribe(() => {
                  return;
                });
            }
          });
        }
      });
  }

  read(notification: Notification) {
    this.http.patch(this.baseUrl + `notification/${notification.id}`, {})
      .subscribe();
    if (notification.title === 'New Document Received') {
      this.openDialog(notification.item);
    } else if (notification.title === 'New User') {
      this.router.navigate(['/', 'users', 'view', notification.item])
        .then(() => { return; });
    } else {

    }
  }

  onFilter() {
    this.filteredDataSource.data = this.dataSource.filteredData.filter((data) => {
      if (this.filter === 'all') {
        return data;
      } else {
        return data?.title.includes(this.filter);
      }
    });
  }

}
