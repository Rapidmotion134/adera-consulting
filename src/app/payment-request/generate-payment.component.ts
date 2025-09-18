import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Location} from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ActivatedRoute} from "@angular/router";
import {Payment} from '../interfaces';

@Component({
    selector: 'app-generate-invoice',
    imports: [
        FormsModule,
    ],
    templateUrl: './generate-payment.component.html',
    styleUrl: './generate-payment.component.scss'
})
export class GeneratePaymentComponent implements OnInit{

  baseUrl: string = environment.baseUrl;
  userId: any;
  title: any;
  bankName: any;
  accountName: any;
  accountNumber: any;
  stripeAmount!: any;
  amount!: any;
  success: boolean = false;

  constructor(
    private location: Location,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
  }

  navigateBack() {
    this.location.back();
  }

  done () {
    this.title = '';
    this.bankName = '';
    this.accountName = '';
    this.accountNumber = '';
    this.stripeAmount = undefined;
    this.amount = undefined;
    this.success = false;
  }

  sendPayment() {
    if (this.userId && this.title && this.accountName && this.accountNumber
    && this.bankName && this.amount && this.stripeAmount) {
      this.http.post<Payment>(this.baseUrl + 'payment/', {
        title: this.title, userId: this.userId, stripeAmount: this.stripeAmount, amount: this.amount,
        bankName: this.bankName, accountName: this.accountName, bankAccount: this.accountNumber,
      }).subscribe((data) => {
        if (data) {
          this.success = true;
        }
      });
    }
  }

}
