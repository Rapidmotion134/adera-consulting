import {BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class DataService {
  private _isAdmin$ = new BehaviorSubject<boolean>(this.getIsAdminFromStorage());

  isAdmin$ = this._isAdmin$.asObservable();

  setIsAdmin(data: boolean) {
    this._isAdmin$.next(data);
    localStorage.setItem('isAdmin', JSON.stringify(data));  // Persist the value in localStorage
  }

  private getIsAdminFromStorage(): boolean {
    const storedValue = localStorage.getItem('isAdmin');
    // @ts-ignore
    return storedValue !== null ? JSON.parse(storedValue) : false;  // Default to true if not found
  }
}
