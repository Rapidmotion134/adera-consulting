import {Component, OnInit} from '@angular/core';
import {DragAndDropUploadComponent} from '../drag-and-drop-upload/drag-and-drop-upload.component';
import {FormsModule} from '@angular/forms';
import {environment} from '../../environments/environment';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Page} from '../interfaces';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-create-page',
  imports: [
    DragAndDropUploadComponent,
    FormsModule
  ],
  templateUrl: './create-page.html',
  styleUrl: './create-page.scss'
})
export class CreatePage implements OnInit {

  baseUrl: string = environment.baseUrl;
  pageId!: number;
  title!: string;
  imageLink!: string;
  description!: string;
  url!: string;
  category: 'Service Request' | 'Appointment Request' | 'Support Request' = "Service Request";
  isEdit!: boolean;
  success: boolean = false;

  constructor(private location: Location,
              private http: HttpClient,
              private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.url
      .subscribe((data) => {
        if (data[1].path === 'edit') {
          this.isEdit = true;
          const page: Page = JSON.parse(`${localStorage.getItem('page')}`);
          this.pageId = page.id;
          this.title = page.title;
          this.imageLink = page.image;
          this.description = page.description;
          this.url = page.url;
        }
      });
  }

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
      this.http.post<Page>(this.baseUrl + `page/`, {
        image: this.imageLink, title: this.title, url: this.url,
        description: this.description, category: this.category
      }).subscribe((data) => {
        if (data) {
          this.success = true;
        }
      })
    } else {

    }
  }

  editPage() {
    if (this.title && this.imageLink && this.url && this.description) {
      this.http.patch<Page>(this.baseUrl + `page/${this.pageId}/`, {
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
