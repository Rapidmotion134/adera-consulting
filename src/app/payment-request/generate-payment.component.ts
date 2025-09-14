import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Location} from "@angular/common";
import {DragAndDropUploadComponent} from "../drag-and-drop-upload/drag-and-drop-upload.component";
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
  url: any;

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

  onFileUploaded(fileUploadEvent: { url: string; index: number }): void {
    this.url = fileUploadEvent.url;
    console.log(this.url);
  }

  sendInvoice() {
    if (this.userId && this.title && this.url) {
      this.http.post<Payment>(this.baseUrl + 'payment', {
        title: this.title, url: this.url, userId: this.userId
      }).subscribe((data) => {
        if (data) {
          this.location.back();
        }
      });
    }
  }

}
