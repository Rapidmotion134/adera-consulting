import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {DatePipe, Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Milestone, Project, User} from '../interfaces';
import {FormsModule} from '@angular/forms';
import {DragAndDropUploadComponent} from '../drag-and-drop-upload/drag-and-drop-upload.component';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-add-milestone',
  imports: [
    FormsModule,
    DragAndDropUploadComponent,
    MatIconButton,
    MatIcon,
    DatePipe,
  ],
  templateUrl: './add-milestone.component.html',
  styleUrl: './add-milestone.component.scss',
  standalone: true,
  providers: []
})
export class AddMilestoneComponent implements OnInit {

  baseUrl: string = environment.baseUrl;
  isEdit!: boolean;
  isSuperAdmin: boolean = JSON.parse(`${localStorage.getItem('isSuper')}`);
  success: boolean = false;
  users: User[] = [];
  user!: User;
  projectName: string = '';
  admins: User[] = [];
  admin!: User;
  lastUpdated: Date = new Date();
  startDate: Date = new Date();
  finishDate!: Date;
  projectId!: string;
  isError: boolean = false;
  milestones: Milestone[] = [{
    //@ts-ignore
    id: null,
    title: "",
    startDate: new Date(),
    dueDate: new Date(),
    status: "pending",
    tasks: []
  }];

  constructor(private location: Location,
              private http: HttpClient,
              private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.url
      .subscribe((data) => {
        if (data[1].path === 'edit') {
          this.isEdit = true;
          this.projectId = data[2].path;
          console.log(this.projectId);
        }
      });
    if(!this.isEdit) {
      this.http.get<User[]>(this.baseUrl + `user`)
        .subscribe((data) => {
          if (data.length) {
            data.sort((a, b) => {
              if (a.registrationDate > b.registrationDate) return -1;
              if (a.registrationDate < b.registrationDate) return 1;
              return 0;
            });
            this.users = data;
          }
        });
    } else {
      this.http.get<Project>(this.baseUrl + `project/${this.projectId}/`)
        .subscribe((data) => {
          if (data) {
            this.lastUpdated = data.lastUpdated;
            this.projectName = data.title;
            this.admin = data.admin;
            this.startDate = data.startDate;
            this.finishDate = data.dueDate;
            this.milestones = data.milestones;
          }
        });
    }
    if(this.isSuperAdmin) {
      this.http.get<User[]>(this.baseUrl + `user/admins`)
        .subscribe((data) => {
          if (data) {
            this.admins = data;
          }
        });
    }
  }


  navigateBack() {
    this.location.back();
  }

  done() {
    this.success = false;
  }

  addTask(index: number): void {
    this.milestones[index].tasks.push({
      id: null,
      title: '',
      description: '',
      beginDate: new Date(),
      dueDate: new Date(),
      status: 'pending',
      documents: []
    });
  }

  addMilestone(): void {
    this.milestones.push({
      // @ts-ignore
      id: null,
      title: "",
      startDate: new Date(),
      dueDate: new Date(),
      status: "pending",
      tasks: []
    })
  }

  createProject() {
    if (this.isSuperAdmin) {
      if (this.user && this.admin && this.startDate && this.finishDate && this.projectName) {
        this.http.post<Project>(this.baseUrl + `project/`, {
          user: this.user, title: this.projectName, admin: this.admin, startDate: this.startDate,
          dueDate: this.finishDate, milestones: this.milestones.length ? this.milestones : null,
        }).subscribe((data) => {
          if (data) {
            console.log(data);
            this.success = true;
          }
        })
      } else {
        this.isError = true;
      }
    } else {
      if (this.user && this.startDate && this.finishDate && this.projectName) {
        this.http.post<Project>(this.baseUrl + `project/`, {
          user: this.user, title: this.projectName, startDate: this.startDate,
          dueDate: this.finishDate, milestones: this.milestones.length ? this.milestones : null,
        }).subscribe((data) => {
          if (data) {
            console.log(data);
            this.success = true;
          }
        })
      } else {
        this.isError = true;
      }
    }
  }

  editProject() {
    if (this.isSuperAdmin) {
      if (this.admin && this.startDate && this.finishDate && this.projectName) {
        this.http.patch<Project>(this.baseUrl + `project/${this.projectId}/`, {
          title: this.projectName, admin: this.admin, startDate: this.startDate,
          dueDate: this.finishDate, milestones: this.milestones.length ? this.milestones : null,
        }).subscribe((data) => {
          if (data) {
            this.success = true;
          }
        })
      } else {
        this.isError = true;
      }
    } else {
      if (this.startDate && this.finishDate && this.projectName) {
        this.http.patch<Project>(this.baseUrl + `project/${this.projectId}/`, {
          title: this.projectName, admin: this.admin, startDate: this.startDate,
          dueDate: this.finishDate, milestones: this.milestones.length ? this.milestones : null,
        }).subscribe((data) => {
          if (data) {
            this.success = true;
          }
        })
      } else {
        this.isError = true;
      }
    }
  }

  onFileUploaded(
    fileUploadEvent: { url: string; index: number },
    milestoneIndex: number, taskIndex: number): void {
    const name = fileUploadEvent.url.split('-')[2];
    const fileType = fileUploadEvent.url.split('.')[1];
    this.milestones[milestoneIndex].tasks[taskIndex].documents.push({
      category: "Milestone",
      date: new Date(),
      title: name,
      type: fileType,
      url: fileUploadEvent.url,
      user: this.user,
    })
  }

  removeFile(index: number, taskIndex: number, milestoneIndex: number) {
    this.milestones[milestoneIndex].tasks[taskIndex].documents.splice(index, 1);
  }

  compareAdmin(a: User, b: User): boolean {
    return a && b ? a.id === b.id : a === b;
  }

}
