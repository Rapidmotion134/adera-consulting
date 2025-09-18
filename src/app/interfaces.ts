export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: Date;
  isAdmin: boolean;
  isActive: boolean;
}

export interface Document {
  id: number;
  title: string;
  type: string;
  isSent: boolean;
  productId: string;
  isRequested: boolean;
  date: Date;
  isRead: boolean;
  url: string;
  user: User;
  // request: Request;
}

export interface Notification {
  id: number;
  title:
    | 'Expiration Notification'
    | 'Payment Received'
    | 'New User'
    | 'New Order Received'
    | 'New Document Received'
    | 'Document Request';
  description: string;
  isRead: boolean;
  item: number;
  date: Date;
  user: User;
}

export interface Payment {
  id: number;
  title: string;
  bankName: string;
  bankAccount: string;
  accountName: string;
  stripeAmount: number;
  amount: number;
  date: Date;
  url: string;
  isPaid: boolean;
  user: User;
}

export interface Page {
  id: number;
  title: string;
  url: string;
  description: string;
  image: string;
}
