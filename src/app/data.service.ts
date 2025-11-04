import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class DataService {
  private _isAdmin$ = new BehaviorSubject<boolean>(this.getIsAdminFromStorage());
  private _adminType$ = new BehaviorSubject<string>(this.getAdminTypeFromStorage());

  isAdmin$ = this._isAdmin$.asObservable();
  adminType$ = this._adminType$.asObservable();

  setIsAdmin(data: boolean) {
    this._isAdmin$.next(data);
    localStorage.setItem('isAdmin', JSON.stringify(data));  // Persist the value in localStorage
  }

  setAdminType(data: string) {
    this._adminType$.next(data);
    localStorage.setItem('adminType', data);
  }

  private getIsAdminFromStorage(): boolean {
    const storedValue = localStorage.getItem('isAdmin');
    // @ts-ignore
    return storedValue !== null ? JSON.parse(storedValue) : false;  // Default to true if not found
  }

  private getAdminTypeFromStorage(): string {
    const storedValue = localStorage.getItem('adminType');
    // @ts-ignore
    return storedValue !== null ? storedValue : null;
  }
}
