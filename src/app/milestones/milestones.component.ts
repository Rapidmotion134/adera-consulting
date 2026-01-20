import {Component, OnInit} from '@angular/core';
import {Milestone, Task} from '../interfaces';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DatePipe, NgClass, TitleCasePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../data.service';
import {ActivatedRoute} from '@angular/router';
import {SharedService} from '../shared.service';
import {environment} from '../../environments/environment';
import {MatTableResponsiveModule} from '../mat-table-responsive/mat-table-responsive.module';

@Component({
  selector: 'app-milestones',
  imports: [MatTableModule, MatButtonModule, MatIconModule, TitleCasePipe, DatePipe, NgClass, MatTableResponsiveModule],
  templateUrl: './milestones.component.html',
  styleUrl: './milestones.component.scss'
})
export class MilestonesComponent implements OnInit {

  milestones!: Milestone[];
  baseUrl: string = environment.baseUrl;
  isAdmin: boolean = false;
  selectedMilestone!: number;
  userId!: string;
  dataSource!: MatTableDataSource<Task>;
  columnsToDisplay = ['no', 'title', 'start date', 'due date', 'status'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: Task | null;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    this.dataService.isAdmin$.subscribe((data) => {
      this.isAdmin = data;
    });
    if (this.isAdmin) {
      const userId = `${this.activatedRoute.snapshot.paramMap.get('userId')}`;
      this.http.get<Milestone[]>(this.baseUrl + `milestone/user/${userId}`)
        .subscribe((data) => {
          if (data) {
            console.log(data);
            this.milestones = data;
            this.selectedMilestone = data[0].id;
            this.dataSource = new MatTableDataSource(data[0].tasks);
          }
        });
    } else {
      const userId = localStorage.getItem('userId');
      this.http.get<Milestone[]>(this.baseUrl + `milestone/user/${userId}`)
        .subscribe((data) => {
          if (data) {
            console.log(data);
            this.milestones = data;
            this.selectedMilestone = data[0].id;
            this.dataSource = new MatTableDataSource(data[0].tasks);
          }
        });
    }
  }

  /** Checks whether a task is expanded. */
  isExpanded(task: Task) {
    return this.expandedElement === task;
  }

  /** Toggles the expanded state of a task. */
  toggle(task: Task) {
    this.expandedElement = this.isExpanded(task) ? null : task;
  }

  downloadFile(url: string) {
    this.sharedService.getDownloadUrl(url);
  }

  selectMilestone(milestone: Milestone) {
    this.selectedMilestone = milestone.id;
    this.dataSource = new MatTableDataSource(milestone.tasks);
  }
}
