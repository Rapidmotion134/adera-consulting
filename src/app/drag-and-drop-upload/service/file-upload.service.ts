import { HttpClient, HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Observable, of, throwError } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import {
  IFileUploadService,
  UploadProgress,
} from './file-upload.service.interface';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class FileUploadService implements IFileUploadService {
  constructor(
    private http: HttpClient,
  ) { }

  upload(fileToUpload: File): Observable<UploadProgress> {
    const url = `${environment.baseUrl}upload`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    const initialProgress: UploadProgress = {
      progress: 0,
      state: 'PENDING',
      url: undefined,
    };

    const makeRequest = this.http
      .post(url, formData, { reportProgress: true, observe: 'events' })
      .pipe(
        filter(
          (event) =>
            event.type === HttpEventType.UploadProgress ||
            event.type === HttpEventType.Response
        ),
        // prevent passing in events of type upload progress if the total is not valid value
        filter(
          (event) =>
            !(event.type === HttpEventType.UploadProgress && !event.total)
        ),
        map((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress: UploadProgress = {
              // @ts-ignore
              progress: Math.round((100 * event.loaded) / event.total),
              state: 'IN_PROGRESS',
            };
            return progress;
          }
          const done: UploadProgress = {
            progress: 100,
            state: 'DONE',
          };
          const res = (event as HttpResponse<object>).body;
          // @ts-ignore
          if (res['message'] === 'File uploaded successfully') {
            // @ts-ignore
            done.url = res['s3Uri'];
          }
          return done;
        }),
        catchError(this.handleError)
      );
    return merge(of(initialProgress), makeRequest);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error({ error });
    // Check for network error
    if (error.status === 0 && error.headers.keys().length === 0) {
      // Possible additional checks
      // error.error instanceof Event && error.error.type === "error" && error.statusText === "Unknown Error"
      // Return an observable with a user-facing error message.
      return throwError(
        'Network error; please check your connection and try again.'
      );
    } else if (error.status === undefined) {
      // A client-side error. Something like parsing or other errors. Handle it accordingly.
      console.error('An client-side error occurred:', error.message);
      // Return an observable with a user-facing error message.
      return throwError('Something bad happened; please try again later.');
    } else if (error.status > 0) {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
      // Return an observable with a user-facing error message.
      return throwError(error.error.message);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
