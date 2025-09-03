import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './auth/auth-guard';
import {DocumentsComponent} from './documents/documents.component';
import {SelectUserComponent} from './select-user/select-user.component';
import {UsersComponent} from './users/users.component';
import {AttachFilesComponent} from './attach-files/attach-files.component';
import {PaymentComponent} from './payment/payment.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {PagesComponent} from './pages/pages.component';
// import {FinancialsComponent} from "./financials/financials.component";
// import {UsersComponent} from "./users/users.component";
// import {ActionsComponent} from "./actions/actions.component";
// import {CompanyDocumentsComponent} from "./company-documents/company-documents.component";
// import {NotificationsComponent} from "./notifications/notifications.component";
// import {OrdersComponent} from "./orders/orders.component";
// import {PaymentComponent} from "./payment/payment.component";
// import {InvoicesComponent} from "./invoices/invoices.component";
// import {FaqsComponent} from "./faqs/faqs.component";
// import {ViewOrderComponent} from "./view-order/view-order.component";
// import {AttachFilesComponent} from "./attach-files/attach-files.component";
// import {CreateAccountComponent} from "./create-account/create-account.component";
// import {RequestDocumentComponent} from "./request-document/request-document.component";
// import {GenerateInvoiceComponent} from "./generate-invoice/generate-invoice.component";
// import {ViewUserComponent} from "./view-user/view-user.component";
// import {AuthGuard} from "./auth/auth-guard";
// import {CheckoutComponent} from "./checkout/checkout.component";

export const routes: Routes = [
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'dashboard', pathMatch: 'full', component: DashboardComponent,/* canActivate: [AuthGuard]*/ },
  // { path: 'financials', pathMatch: 'full', component: FinancialsComponent, canActivate: [AuthGuard] },
  { path: 'users', pathMatch: 'full', component: UsersComponent, /*canActivate: [AuthGuard]*/ },
  // { path: 'users/view/:userId', pathMatch: 'full', component: ViewUserComponent, canActivate: [AuthGuard] },
  // { path: 'users/create', pathMatch: 'full', component: CreateAccountComponent, canActivate: [AuthGuard] },
  // { path: 'users/edit', pathMatch: 'full', component: CreateAccountComponent, canActivate: [AuthGuard] },
  { path: 'document/select', pathMatch: 'full', component: SelectUserComponent, /*canActivate: [AuthGuard]*/ },
  { path: 'document/sendTo/:userId', pathMatch: 'full', component: AttachFilesComponent, /*canActivate: [AuthGuard]*/ },
  // { path: 'document/request', pathMatch: 'full', component: AttachFilesComponent, canActivate: [AuthGuard] },
  // { path: 'invoice/select', pathMatch: 'full', component: SelectUserComponent, canActivate: [AuthGuard] },
  // { path: 'invoice/sendTo/:userId', pathMatch: 'full', component: GenerateInvoiceComponent, canActivate: [AuthGuard] },
  // { path: 'request/select', pathMatch: 'full', component: SelectUserComponent, canActivate: [AuthGuard] },
  // { path: 'request/sendTo/:userId', pathMatch: 'full', component: RequestDocumentComponent, canActivate: [AuthGuard] },
  // { path: 'actions', pathMatch: 'full', component: ActionsComponent, canActivate: [AuthGuard] },
  { path: 'documents', pathMatch: 'full', component: DocumentsComponent, /*canActivate: [AuthGuard]*/ },
  // { path: 'documents/:userId', pathMatch: 'full', component: DocumentsComponent, canActivate: [AuthGuard] },
  // { path: 'notifications', pathMatch: 'full', component: NotificationsComponent, canActivate: [AuthGuard] },
  // { path: 'notifications/expiring', pathMatch: 'full', component: NotificationsComponent, canActivate: [AuthGuard] },
  // { path: 'orders', pathMatch: 'full', component: OrdersComponent, canActivate: [AuthGuard] },
  // { path: 'orders/user/:userId', pathMatch: 'full', component: OrdersComponent, canActivate: [AuthGuard] },
  // { path: 'orders/:orderId', pathMatch: 'full', component: ViewOrderComponent, canActivate: [AuthGuard] },
  // { path: 'orders/:orderId/attach', pathMatch: 'full', component: AttachFilesComponent, canActivate: [AuthGuard] },
  { path: 'payment', pathMatch: 'full', component: PaymentComponent, /*canActivate: [AuthGuard]*/ },
  { path: 'checkout', pathMatch: 'full', component: CheckoutComponent, /*canActivate: [AuthGuard]*/ },
  { path: 'pages', pathMatch: 'full', component: PagesComponent, /*canActivate: [AuthGuard]*/ },
  // { path: 'invoices', pathMatch: 'full', component: InvoicesComponent, canActivate: [AuthGuard] },
  // { path: 'faq', pathMatch: 'full', component: FaqsComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
