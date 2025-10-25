import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, of, filter, tap } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  imports: [
		FormsModule,
	],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

	baseUrl: string = environment.baseUrl;
	phone!: string;
  address!: string;
  password!: string;
  confirmPassword!: string;
	userId: string = `${localStorage.getItem('userId')}`;

	success: boolean = false;

	constructor(
    private http: HttpClient,
		private router: Router
	) { }

	done() {
    this.router.navigate(['/', 'dashboard']).then(()=> {return;});
  }

	submit() {
		
		if (this.password && this.confirmPassword && this.phone && this.address) {
			if (this.password === this.confirmPassword) {
				this.http.patch(this.baseUrl + `user/completesignup/${this.userId}`, {
					password: this.password, phone: this.phone, address: this.address
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
