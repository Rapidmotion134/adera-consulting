import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Milestone, Task, User} from '../interfaces';
import {MilestonesComponent} from '../milestones/milestones.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-add-milestone',
  imports: [
    FormsModule,
  ],
  templateUrl: './add-milestone.component.html',
  styleUrl: './add-milestone.component.scss',
  providers: []
})
export class AddMilestoneComponent implements OnInit {

  baseUrl: string = environment.baseUrl;
  isEdit!: boolean;
  success: boolean = false;
  milestoneId!: number;
  users: User[] = [];
  user!: User;
  projectName: string = '';
  admins: User[] = [];
  admin: string = '';
  startDate: Date = new Date();
  finishDate!: Date;
  milestones: number[] = [ 1 ];
  tasks: Task[] = [];
  newTask: Task = {
    beginDate: new Date(),
    description: '',
    documents: [],
    dueDate: new Date(),
    status: "pending",
    title: ''
  }

  constructor(private location: Location,
              private http: HttpClient,
              private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.url
      .subscribe((data) => {
        if (data[1].path === 'edit') {
          this.isEdit = true;
          const milestone: MilestonesComponent = JSON.parse(`${localStorage.getItem('milestone')}`);
        }
      });
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
    this.http.get<User[]>(this.baseUrl + `user/admins`)
      .subscribe((data) => {
        if (data) {
          this.admins = data;
        }
      });
  }


  navigateBack() {
    this.location.back();
  }

  done() {
    this.success = false;
  }

  addTask(): void {
    this.tasks.push(this.newTask);
  }

  createMilestone() {
    if (this.user && this.admin && this.startDate && this.finishDate && this.projectName) {
      this.http.post<Milestone>(this.baseUrl + `milestone`, {
        user: this.user, title: this.projectName, admin: this.admin, startDate: this.startDate, dueDate: this.finishDate,
        tasks: this.tasks.length ? this.tasks : null,
      }).subscribe((data) => {
        if (data) {
          console.log(data);
          this.success = true;
        }
      })
    } else {

    }
  }

  editMilestone() {
    if (true) {
      this.http.patch<MilestonesComponent>(this.baseUrl + `milestone/${this.milestoneId}/`, {

      }).subscribe((data) => {
        if (data) {
          this.success = true;
        }
      })
    } else {

    }
  }

}
