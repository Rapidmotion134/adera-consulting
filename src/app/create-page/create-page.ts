import { Component } from '@angular/core';
import {DragAndDropUploadComponent} from '../drag-and-drop-upload/drag-and-drop-upload.component';
import {FormsModule} from '@angular/forms';
import {environment} from '../../environments/environment';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Page} from '../interfaces';

@Component({
  selector: 'app-create-page',
  imports: [
    DragAndDropUploadComponent,
    FormsModule
  ],
  templateUrl: './create-page.html',
  styleUrl: './create-page.scss'
})
export class CreatePage {

  baseUrl: string = environment.baseUrl;
  title!: string;
  imageLink!: string;
  description!: string;
  url!: string;
  success: boolean = false;

  constructor(private location: Location,
              private http: HttpClient) { }

  navigateBack() {
    this.location.back();
  }

  done() {
    this.title = '';
    this.imageLink = '';
    this.description = '';
    this.url = '';
    this.success = false;
  }

  createPage() {
    if (this.title && this.imageLink && this.url && this.description) {
      this.http.post<Page>(this.baseUrl + `page`, {
        image: this.imageLink, title: this.title, url: this.url, description: this.description
      }).subscribe((data) => {
        if (data) {
          this.success = true;
        }
      })
    } else {

    }
  }

  onFileUploaded(fileUploadEvent: { url: string; index: number }): void {
    this.imageLink = fileUploadEvent.url;
  }

}
