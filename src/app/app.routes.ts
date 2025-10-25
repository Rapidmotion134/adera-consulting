import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './auth/auth-guard';
import {DocumentsComponent} from './documents/documents.component';
import {SelectUserComponent} from './select-user/select-user.component';
import {UsersComponent} from './users/users.component';
import {AttachFilesComponent} from './attach-files/attach-files.component';
import {PaymentComponent} from './payment/payment.component';
import {PagesComponent} from './pages/pages.component';
import {GeneratePaymentComponent} from './payment-request/generate-payment.component';
import {CreatePage} from './create-page/create-page';
import {CreateAccountComponent} from "./create-account/create-account.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {ViewUserComponent} from './view-user/view-user.component';
import { RegistrationComponent } from './registration/registration.component';
// import {OrdersComponent} from "./orders/orders.component";
// import {ViewOrderComponent} from "./view-order/view-order.component";
// import {RequestDocumentComponent} from "./request-document/request-document.component";

export const routes: Routes = [
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'dashboard', pathMatch: 'full', component: DashboardComponent },
  { path: 'registration', pathMatch: 'full', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'users', pathMatch: 'full', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'users/view/:userId', pathMatch: 'full', component: ViewUserComponent, canActivate: [AuthGuard] },
  { path: 'users/create', pathMatch: 'full', component: CreateAccountComponent, canActivate: [AuthGuard] },
  { path: 'users/edit', pathMatch: 'full', component: CreateAccountComponent, canActivate: [AuthGuard] },
  { path: 'document/select', pathMatch: 'full', component: SelectUserComponent, canActivate: [AuthGuard] },
  { path: 'document/sendTo/:userId', pathMatch: 'full', component: AttachFilesComponent, canActivate: [AuthGuard] },
  { path: 'document/request', pathMatch: 'full', component: AttachFilesComponent, canActivate: [AuthGuard] },
  { path: 'document/upload', pathMatch: 'full', component: AttachFilesComponent, canActivate: [AuthGuard] },
  // { path: 'request/select', pathMatch: 'full', component: SelectUserComponent, canActivate: [AuthGuard] },
  // { path: 'request/sendTo/:userId', pathMatch: 'full', component: RequestDocumentComponent, canActivate: [AuthGuard] },
  { path: 'documents', pathMatch: 'full', component: DocumentsComponent, canActivate: [AuthGuard] },
  // { path: 'documents/:userId', pathMatch: 'full', component: DocumentsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', pathMatch: 'full', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'payment', pathMatch: 'full', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'payment/select', pathMatch: 'full', component: SelectUserComponent, canActivate: [AuthGuard] },
  { path: 'payment/sendTo/:userId', pathMatch: 'full', component: GeneratePaymentComponent, canActivate: [AuthGuard] },
  { path: 'payment/attach/:paymentId', pathMatch: 'full', component: AttachFilesComponent, canActivate: [AuthGuard] },
  // { path: 'checkout/:paymentId', pathMatch: 'full', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'requests', pathMatch: 'full', component: PagesComponent, canActivate: [AuthGuard] },
  { path: 'requests/create', pathMatch: 'full', component: CreatePage, canActivate: [AuthGuard] },
  { path: 'requests/edit', pathMatch: 'full', component: CreatePage, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
