import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {Milestone, Project, Task} from '../interfaces';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DatePipe, NgClass, TitleCasePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedService} from '../shared.service';
import {environment} from '../../environments/environment';
import {MatTableResponsiveModule} from '../mat-table-responsive/mat-table-responsive.module';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';

@Component({
  selector: 'app-milestones',
  imports: [MatTableModule, MatButtonModule, MatIconModule, TitleCasePipe, DatePipe, NgClass, MatTableResponsiveModule, MatMenuTrigger, MatMenu, MatMenuItem],
  templateUrl: './milestones.component.html',
  standalone: true,
  styleUrl: './milestones.component.scss'
})
export class MilestonesComponent implements OnInit {

  milestones!: Milestone[];
  baseUrl: string = environment.baseUrl;
  isAdmin: boolean = false;
  selectedMilestone!: number;
  userId!: string;
  dataSource!: MatTableDataSource<Task>;
  columnsToDisplay = ['no', 'title', 'start date', 'due date', 'status', 'actions'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: Task | null;
  projectId!: string;
  dialog = inject(MatDialog);

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    this.dataService.isAdmin$.subscribe((data) => {
      this.isAdmin = data;
    });
    this.projectId = `${this.activatedRoute.snapshot.paramMap.get('projectId')}`;
    this.getMilestones(this.projectId);
  }

  openDialog() {
    this.dialog.open(MilestoneDialog);
  }

  getMilestones(projectId: string) {
    this.http.get<Project>(this.baseUrl + `project/${projectId}`)
      .subscribe((data) => {
        if (data) {
          this.milestones = data.milestones;
          this.selectedMilestone = data.milestones[0].id;
          this.dataSource = new MatTableDataSource(data.milestones[0].tasks);
        }
      });
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

  updateMilestoneStatus(milestone: Milestone, status: 'pending' | 'in-progress' | 'completed') {
    if (status === 'completed') {
      let completed: boolean = true;
      milestone.tasks.forEach((task: Task) => {
        if (task.status !== 'completed') {
          completed = false;
        }
      })
      if (completed) {
        this.http.patch<Milestone>(this.baseUrl + `milestone/status/${milestone.id}`, {
          status,
        }).subscribe((data) => {
          if (data) {
            this.milestones.forEach((currentMilestone: Milestone) => {
              if (currentMilestone.id === milestone.id) {
                currentMilestone.status = data.status;
              }
            })
          }
        });
      } else {
        this.openDialog();
      }
    } else {
      this.http.patch<Milestone>(this.baseUrl + `milestone/status/${milestone.id}`, {
        status,
      }).subscribe((data) => {
        if (data) {
          this.milestones.forEach((currentMilestone: Milestone) => {
            if (currentMilestone.id === milestone.id) {
              currentMilestone.status = data.status;
            }
          })
        }
      });
    }
  }

  updateTaskStatus(task: Task, status: 'pending' | 'in-progress' | 'completed') {
    this.http.patch<Milestone>(this.baseUrl + `milestone/${this.selectedMilestone}/task/${task.id}/status/`, {
      status,
    }).subscribe((data) => {
      if (data) {
        this.milestones.forEach((milestone: Milestone) => {
          if (milestone.id === this.selectedMilestone) {
            milestone.tasks.forEach((loopTask: Task) => {
              if (loopTask.id === task.id) {
                data.tasks.forEach((r: Task) => {
                  if (r.id === task.id) {
                    task.status = r.status;
                  }
                })
              }
            })
          }
        })
      }
    });
  }

  editProject() {
    this.router.navigate(['/', 'projects', 'edit', this.projectId]).then(()=> {return;});
  }
}

@Component({
  selector: 'milestone-dialog',
  templateUrl: 'milestone-dialog.html',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class MilestoneDialog {}
