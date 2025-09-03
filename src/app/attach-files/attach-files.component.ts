import {Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {DragAndDropUploadComponent} from "../drag-and-drop-upload/drag-and-drop-upload.component";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {provideNativeDateAdapter} from "@angular/material/core";

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
  isOrder!: boolean;
  isRequest!: boolean;
  orderId: any;
  userId: any;
  url!: string;
  issueDate = new FormControl(new Date());
  expiryDate = new FormControl(
    new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDay(),
  ));
  success: boolean = false;

  constructor(private location: Location,
              private route: ActivatedRoute,
              private http: HttpClient) { }

  ngOnInit() {
    if((this.route.snapshot.url[0].path) === 'orders') {
      this.orderId = this.route.snapshot.paramMap.get('orderId');
      const temp = JSON.parse(`${localStorage.getItem('order')}`);
      if (temp.id == this.orderId) {

      }
      this.isOrder = true;
      this.isRequest = false;
    } else if ((this.route.snapshot.url[1].path) === 'sendTo') {
      this.isOrder = false;
      this.isRequest = false;
      this.userId = this.route.snapshot.paramMap.get('userId');
    } else {
      this.isOrder = false;
      this.isRequest = true;
      this.userId = this.route.snapshot.paramMap.get('userId');
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
    if (this.isOrder) {
      if (this.title && this.url && this.expiryDate.value && this.issueDate.value) {
        this.http.post<Document>(this.baseUrl + `document/order`, {
          title: this.title, type: this.type, url: this.url, orderId: this.orderId, issueDate: this.issueDate.value, expireDate: this.expiryDate.value,
        }).subscribe((data) => {
          if (data) {
            this.success = true;
          }
        });
      }
    } else if (this.isRequest) {
      if(this.title && this.url && this.expiryDate.value && this.issueDate.value) {
        this.http.post<Document>(this.baseUrl + `document/request`, {
          title: this.title, url: this.url, issueDate: this.issueDate.value, expireDate: this.expiryDate.value,
        }).subscribe((data) => {
          if (data) {
            this.success = true;
          }
        });
      }
    } else {
      if(this.title && this.url && this.expiryDate.value && this.issueDate.value && this.type) {
        this.http.post<Document>(this.baseUrl + `document`, {
          title: this.title, type: this.type, url: this.url, userId: this.userId, issueDate: this.issueDate.value, expireDate: this.expiryDate.value,
        }).subscribe((data) => {
          if (data) {
            this.success = true;
          }
        });
      }
    }
  }

  onFileUploaded(fileUploadEvent: { url: string; index: number }): void {
    this.url = fileUploadEvent.url;
  }
}
