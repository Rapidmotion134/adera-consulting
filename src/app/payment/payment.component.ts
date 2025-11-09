import {Component, inject, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Router, RouterLink} from "@angular/router";
import {MatTableResponsiveModule} from "../mat-table-responsive/mat-table-responsive.module";
import { MatButtonModule } from '@angular/material/button';
import {DataService} from '../data.service';
import {DatePipe, Location, NgClass, TitleCasePipe} from '@angular/common';
import {Payment} from '../interfaces';
import {MatDialog} from '@angular/material/dialog';
import {PaymentDialog} from './payment-dialog';
import {SharedService} from '../shared.service';

@Component({
  selector: 'app-payment',
  imports: [
    MatTableModule,
    MatTableResponsiveModule,
    MatButtonModule,
    TitleCasePipe,
    NgClass,
    RouterLink,
    DatePipe,
  ],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit{
  state: 0 | 1 | 2 = 0;
  baseUrl: string = environment.baseUrl;
  displayedColumns: string[] = ['no', 'service', 'name', 'amount', 'date', 'status', 'action'];
  userId: any = localStorage.getItem('userId');
  isFirst: boolean = true;
  isAdmin!: boolean;
  payments: MatTableDataSource<Payment> = new MatTableDataSource<Payment>([]);
  dialog = inject(MatDialog);

  constructor(private http: HttpClient,
              private dataService: DataService,
              private location: Location,
              private sharedService: SharedService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.dataService.isAdmin$.subscribe((data) => {
      this.isAdmin = data;
    });
    if (this.isAdmin) {
      this.http.get<Payment[]>(`${this.baseUrl}payment`)
        .subscribe((data: Payment[]) => {
          if (data && data.length > 0) {
            this.payments = new MatTableDataSource<Payment>(data);
          }
        })
    } else {
      this.http.get<Payment[]>(`${this.baseUrl}payment/${this.userId}`)
        .subscribe((data: Payment[]) => {
          if (data && data.length > 0) {
            this.payments = new MatTableDataSource<Payment>(data);
          }
        })
    }
    if (!this.isFirst) {
      this.state = 1
    }
  }

  openDialog(payment: Payment) {
    const dialogRef = this.dialog.open(PaymentDialog, {
      data: {
        payment: payment,
      },
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.sharedService.getDownloadUrl(payment.url);
      }
    });
  }

  // checkout (payment: Payment) {
  //   localStorage.setItem('payment', JSON.stringify(payment));
  //   this.router.navigate(['/', 'checkout', payment.id]).then(()=> {return;});
  // }

  navigateBack() {
    this.location.back();
  }

}
