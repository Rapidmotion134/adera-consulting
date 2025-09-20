import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {Component, inject} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {DatePipe, TitleCasePipe} from "@angular/common";
import {Payment} from '../interfaces';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
    selector: 'payment-dialog',
    templateUrl: 'view-payment-dialog.html',
    styleUrl: 'view-payment-dialog.scss',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton, DatePipe, TitleCasePipe]
})
export class PaymentDialog {
  constructor(public http: HttpClient) {}

  baseUrl: string = environment.baseUrl;
  readonly dialogRef = inject(MatDialogRef<PaymentDialog>);
  data = inject(MAT_DIALOG_DATA);

  accept(payment: Payment) {
    this.http.patch<Payment>(`${this.baseUrl}/payment/accept/${payment.id}`, {})
      .subscribe((data) => {
        if (data.isAccepted){
          this.dialogRef.close();
        }
      })
  }

  reject(payment: Payment) {
    this.http.patch<Payment>(`${this.baseUrl}/payment/reject/${payment.id}`, {})
      .subscribe((data) => {
        if (data.isRejected){
          this.dialogRef.close();
        }
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
