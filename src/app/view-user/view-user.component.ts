import {Component, inject} from '@angular/core';
import {User} from "../interfaces";
import {environment} from "../../environments/environment";
import {Location, TitleCasePipe} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {Clipboard} from "@angular/cdk/clipboard";
import {MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationDialog} from "./confirmation-dialog";

@Component({
    selector: 'app-view-user',
    imports: [
        TitleCasePipe,
        RouterLink
    ],
    templateUrl: './view-user.component.html',
    styleUrl: './view-user.component.scss'
})
export class ViewUserComponent {

  userId: any;
  user!: User;
  baseUrl: string = environment.baseUrl;
  dialog = inject(MatDialog);

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private clipboard: Clipboard,
    private router: Router
  ) {  }

  clickToCopy(textToCopy: string) {
    this.clipboard.copy(textToCopy);
  }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
    this.http.get<User>(this.baseUrl + `user/${this.userId}`)
      .subscribe((data) => {
        if (data) {
          this.user = data;
        }
      });
  }

  confirmation() {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      minWidth: 700
    });

    dialogRef.afterClosed().subscribe((result: Boolean) => {
      if (result) {
        this.http.delete(this.baseUrl + `user/${this.userId}`)
          .subscribe((data) => {
            if (data) {
              this.location.back();
            }
          });
      }
    });
  }

  // navigateBack() {
  //   this.location.back();
  // }

  changeActivationStatus() {
    this.http.patch<User>(this.baseUrl + `user/active/${this.userId}`, {})
      .subscribe((data) => {
        if (data) {
          this.user = data;
        }
      });
  }

  editUser() {
    localStorage.setItem('user', JSON.stringify(this.user));
    this.router.navigate(['/', 'users', 'edit']).then(()=> {return;});
  }
}
