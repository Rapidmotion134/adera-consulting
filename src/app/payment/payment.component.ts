import {Component, OnInit} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableResponsiveModule} from "../mat-table-responsive/mat-table-responsive.module";
import { MatButtonModule } from '@angular/material/button';
import {DataService} from '../data.service';
import {Order} from '@stripe/stripe-js';
import Payment = Order.Payment;
import {NgClass, TitleCasePipe} from '@angular/common';

@Component({
    selector: 'app-payment',
  imports: [
    MatTableModule,
    MatTableResponsiveModule,
    MatButtonModule,
    TitleCasePipe,
    NgClass,
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
              private route: ActivatedRoute,
              private dataService: DataService,
              private router: Router) {
  }

  ngOnInit(): void {
    // const param = `${this.route.snapshot.queryParamMap.get('state')}`;
    // if(+param === 1 ){
    //   this.state = 1;
    // } else {
    //   this.state = 2;
    // }
    this.dataService.isAdmin$.subscribe((data) => {
      this.isAdmin = data;
    });

    if (!this.isFirst) {
      this.state = 1
    }
  }

  // openDialog(service: Service): void {
  //   if (isValidKey(service.name.toLowerCase().replace(/\s+/g, ""))) {
  //     const dialogRef = this.dialog.open(FormDialog, {
  //     width: '500px',
  //     data: { service },
  //     });
  //     dialogRef.afterClosed().subscribe((result) => {
  //       if (result) {
  //         this.checkout(service, result);
  //       }
  //     });
  //   } else {
  //     this.checkout(service, '');
  //   }
  // }

  checkout () {
    // localStorage.setItem('service', JSON.stringify(service));
    this.router.navigate(['/', 'checkout']).then(()=> {return;});
  }

}
