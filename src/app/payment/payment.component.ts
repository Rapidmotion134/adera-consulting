import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Router, RouterLink} from "@angular/router";
import {MatTableResponsiveModule} from "../mat-table-responsive/mat-table-responsive.module";
import { MatButtonModule } from '@angular/material/button';
import {DataService} from '../data.service';
import {NgClass, TitleCasePipe} from '@angular/common';
import {Payment} from '../interfaces';

@Component({
    selector: 'app-payment',
  imports: [
    MatTableModule,
    MatTableResponsiveModule,
    MatButtonModule,
    TitleCasePipe,
    NgClass,
    RouterLink,
  ],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit{
  state: 0 | 1 | 2 = 0;
  baseUrl: string = environment.baseUrl;
  displayedColumns: string[] = ['no', 'service', 'name', 'amount', 'id', 'date', 'status', 'action'];
  userId: any = localStorage.getItem('userId');
  isFirst: boolean = true;
  isAdmin!: boolean;
  payments: MatTableDataSource<Payment> = new MatTableDataSource<Payment>([]);

  constructor(private http: HttpClient,
              private dataService: DataService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.dataService.isAdmin$.subscribe((data) => {
      this.isAdmin = data;
    });
    if (this.isAdmin) {
      this.http.get<Payment[]>(`${this.baseUrl}/payment`)
        .subscribe((data: Payment[]) => {
          if (data && data.length > 0) {
            this.payments = new MatTableDataSource<Payment>(data);
          }
        })
    } else {
      this.http.get<Payment[]>(`${this.baseUrl}/payment/${this.userId}`)
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

  checkout (payment: Payment) {
    localStorage.setItem('payment', JSON.stringify(payment));
    this.router.navigate(['/', 'checkout', payment.id]).then(()=> {return;});
  }

}
