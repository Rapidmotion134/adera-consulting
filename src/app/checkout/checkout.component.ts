import {Component, OnInit, ViewChild} from '@angular/core';
import {
  StripeCardCvcComponent,
  StripeCardExpiryComponent,
  StripeCardGroupDirective,
  StripeCardNumberComponent,
  StripeService
} from "ngx-stripe";
import {switchMap} from "rxjs";
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {environment} from "../../environments/environment";
import {Location} from "@angular/common";

@Component({
  selector: 'app-checkout',
  imports: [
    ReactiveFormsModule,
    StripeCardExpiryComponent,
    StripeCardCvcComponent,
    StripeCardGroupDirective,
    StripeCardNumberComponent,
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})

export class CheckoutComponent implements OnInit {
  @ViewChild(StripeCardNumberComponent) card!: StripeCardNumberComponent;
  userId: any = localStorage.getItem('userId');
  additionInfo: string = '';
  stripeTest!: FormGroup;
  baseUrl: string = environment.baseUrl;
  success: boolean = false;
  isLoading: boolean = false;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#005e5a',
        color: '#000000',
        '::placeholder': {
          color: '#5f5f5f',
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es',
  };

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]],
    });
    if (localStorage.getItem('service')) {
      //@ts-ignore
      this.service = JSON.parse(localStorage.getItem('service'));
      this.additionInfo = `${localStorage.getItem('additionalInfo')}`;
    }
  }

  pay(): void {
    this.isLoading = true;
    if (this.stripeTest.valid) {
      this.http.post<any>(this.baseUrl + 'stripe/payment/',  {

      })
        .pipe(
          switchMap((pi) =>
            this.stripeService.confirmCardPayment(pi.client_secret, {
                payment_method: {
                  card: this.card.element,
                  billing_details: {
                  name: this.stripeTest.getRawValue().name,
                },
              },
            })
          )
        )
        .subscribe((result) => {
          if (result.error) {
            console.log(result.error.message);
          } else {
            if (result.paymentIntent.status === 'succeeded') {

            }
          }
        });
    } else {
      console.error(this.stripeTest);
    }
  }

  back() {
    this.location.back();
  }
}
