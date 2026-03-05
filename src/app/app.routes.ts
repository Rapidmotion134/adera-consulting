import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './auth/auth-guard';
import {DocumentsComponent} from './documents/documents.component';
import {SelectUserComponent} from './select-user/select-user.component';
import {UsersComponent} from './users/users.component';
import {AttachFilesComponent} from './attach-files/attach-files.component';
import {PaymentComponent} from './payment/payment.component';
import {RequestsComponent} from './requests/requests.component';
import {GeneratePaymentComponent} from './payment-request/generate-payment.component';
import {CreateRequestComponent} from './create-request/create-request.component';
import {CreateAccountComponent} from "./create-account/create-account.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {ViewUserComponent} from './view-user/view-user.component';
import {RegistrationComponent} from './registration/registration.component';
import {MilestonesComponent} from './milestones/milestones.component';
import {AddMilestoneComponent} from './add-milestone/add-milestone.component';
import {ProjectComponent} from './project/project.component';

export const routes: Routes = [
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'dashboard', pathMatch: 'full', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'registration', pathMatch: 'full', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'users', pathMatch: 'full', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'users/view/:userId', pathMatch: 'full', component: ViewUserComponent, canActivate: [AuthGuard] },
  { path: 'users/create', pathMatch: 'full', component: CreateAccountComponent, canActivate: [AuthGuard] },
  { path: 'users/edit', pathMatch: 'full', component: CreateAccountComponent, canActivate: [AuthGuard] },
  { path: 'document/select', pathMatch: 'full', component: SelectUserComponent, canActivate: [AuthGuard] },
  { path: 'document/sendTo/:userId', pathMatch: 'full', component: AttachFilesComponent, canActivate: [AuthGuard] },
  { path: 'document/request', pathMatch: 'full', component: AttachFilesComponent, canActivate: [AuthGuard] },
  { path: 'document/upload', pathMatch: 'full', component: AttachFilesComponent, canActivate: [AuthGuard] },
  { path: 'documents', pathMatch: 'full', component: DocumentsComponent, canActivate: [AuthGuard] },
  { path: 'projects', pathMatch: 'full', component: ProjectComponent, canActivate: [AuthGuard] },
  { path: 'projects/add', pathMatch: 'full', component: AddMilestoneComponent, canActivate: [AuthGuard] },
  { path: 'projects/edit/:projectId', pathMatch: 'full', component: AddMilestoneComponent, canActivate: [AuthGuard] },
  { path: 'projects/milestones/:projectId', pathMatch: 'full', component: MilestonesComponent, canActivate: [AuthGuard] },
  { path: 'documents/:userId', pathMatch: 'full', component: DocumentsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', pathMatch: 'full', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'payment', pathMatch: 'full', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'payment/select', pathMatch: 'full', component: SelectUserComponent, canActivate: [AuthGuard] },
  { path: 'payment/sendTo/:userId', pathMatch: 'full', component: GeneratePaymentComponent, canActivate: [AuthGuard] },
  { path: 'payment/attach/:paymentId', pathMatch: 'full', component: AttachFilesComponent, canActivate: [AuthGuard] },
  { path: 'requests', pathMatch: 'full', component: RequestsComponent, canActivate: [AuthGuard] },
  { path: 'requests/create', pathMatch: 'full', component: CreateRequestComponent, canActivate: [AuthGuard] },
  { path: 'requests/edit', pathMatch: 'full', component: CreateRequestComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
