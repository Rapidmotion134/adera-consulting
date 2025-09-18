import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {DragAndDropUploadComponent} from "../drag-and-drop-upload/drag-and-drop-upload.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {provideNativeDateAdapter} from "@angular/material/core";
import {Document, Payment} from '../interfaces';

@Component({
    selector: 'app-attach-files',
    imports: [
      DragAndDropUploadComponent,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatDatepickerModule,
      ReactiveFormsModule,
      DragAndDropUploadComponent,
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './attach-files.component.html',
    styleUrl: './attach-files.component.scss'
})
export class AttachFilesComponent implements OnInit{

  baseUrl: string = environment.baseUrl;
  title!: string;
  type!: string;
  isRequest: boolean = false;
  isDocument: boolean = false;
  isPayment: boolean = false;
  userId: any;
  paymentId: any;
  url!: string;
  success: boolean = false;

  constructor(private location: Location,
              private route: ActivatedRoute,
              private http: HttpClient) { }

  ngOnInit() {
    const first = this.route.snapshot.url[0].path;
    const second = this.route.snapshot.url[1].path;
    if (first === 'payment') {
      this.isPayment = true;
    } else if ( first === 'document' && second === 'sendTo') {
      this.isDocument = true;
      this.userId = this.route.snapshot.paramMap.get('userId');
    } else {
      this.isRequest = true;
    }
  }

  navigateBack() {
    this.location.back();
  }

  done() {
    this.title = '';
    this.type = '';
    this.url = '';
    this.success = false;
  }

  sendDocument(){
    if (this.isPayment) {
      this.http.post<Payment>(this.baseUrl + `payment/${this.paymentId}/`, {
        url: this.url,
      }).subscribe((data) => {
        if (data.isPaid) {
          this.success = true;
        }
      })
    } else if (this.isDocument) {
      this.http.post<Document>(this.baseUrl + `document/user/${this.userId}/`, {
        title: this.title, url: this.url, type: this.type
      }).subscribe((data) => {
        if (data.url) {
          this.success = true;
        }
      })
    } else {
      this.http.post<Document>(this.baseUrl + `document/requested/`, {
        title: this.title, type: this.type, url: this.url
      }).subscribe((data) => {
        if (data.url) {
          this.success = true;
        }
      })
    }
  }

  onFileUploaded(fileUploadEvent: { url: string; index: number }): void {
    this.url = fileUploadEvent.url;
  }
}
