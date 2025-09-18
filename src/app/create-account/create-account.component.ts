import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Location} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError, filter, of, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {User} from "../interfaces";

@Component({
  selector: 'app-create-account',
  imports: [
    FormsModule,
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent implements OnInit {
  baseUrl: string = environment.baseUrl;
  firstName!: string;
  lastName!: string;
  phone!: string;
  email!: string;
  address!: string;
  password!: string;
  confirmPassword!: string;
  isEdit!: boolean;
  userId!: number;

  success: boolean = false;

  constructor(
    private location: Location,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.url
      .subscribe((data) => {
        if (data[1].path === 'edit') {
          this.isEdit = true;
          const user: User = JSON.parse(`${localStorage.getItem('user')}`);
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.phone = user.phone;
          this.email = user.email;
          this.address = user.address;
          this.userId = user.id;
        }
      });
  }

  done() {
    this.firstName = '';
    this.lastName = '';
    this.phone = '';
    this.email = '';
    this.address = '';
    this.password = '';
    this.confirmPassword = '';
    this.success = false;
  }

  navigateBack() {
    this.location.back();
  }

  submit() {
    if (this.isEdit && this.lastName && this.firstName
      && this.email && this.phone && this.address) {
      this.http.patch(this.baseUrl + `user/${(this.userId)}`, {
        password: this.password, lastName: this.lastName, firstName: this.firstName,
        email: this.email, phone: this.phone, address: this.address,
      }).pipe(
        catchError((err) => {
          console.error(err);
          return of(false);
        }),
        filter((response: any) => !!response),
        tap((response: any): void => {
          console.log(response);
        })
      ).subscribe((data) => {
        if (data) {
          this.success = true;
        }
      });
    } else if (!this.isEdit && this.password && this.confirmPassword && this.lastName
      && this.firstName && this.email && this.phone && this.address) {
      if (this.password === this.confirmPassword) {
        this.http.post(this.baseUrl + 'user/', {
          password: this.password, lastName: this.lastName, firstName: this.firstName,
          email: this.email, phone: this.phone, address: this.address,
        }).pipe(
          catchError((err) => {
            console.error(err);
            return of(false);
          }),
          filter((response: any) => !!response),
          tap((response: any): void => {
            console.log(response);
          })
        ).subscribe((data) => {
          if (data) {
            this.success = true;
          }
        });
      }
    }
  }
}
