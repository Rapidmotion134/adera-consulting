import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Observable, of } from 'rxjs';
import { filter, map, delay } from 'rxjs/operators';
import { IFileUploadService, UploadProgress } from './file-upload.service.interface';

@Injectable()
export class InMemoryFileUploadService implements IFileUploadService {

  // private uploadedFileCount = 0;
  constructor(private http: HttpClient) { }

  // upload(fileToUpload: File): Observable<UploadProgress> {
  //   this.uploadedFileCount++;
  //   console.log('Uploading file: ' + fileToUpload.name);
  //   if (this.uploadedFileCount % 3 === 0) {
  //     // Simulating network errors on every third upload
  //     return throwError('Unable to upload: check you internet connection');
  //   } else {
  //     return of({
  //       progress: 100,
  //       state: 'DONE',
  //       url: 'local'
  //     });
  //   }
  // }
  upload(fileToUpload: File): Observable<UploadProgress> {
    const url = `http://localhost:5000/files/${fileToUpload.name}`;
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    const initialProgress: UploadProgress = {
      progress: 0,
      state: 'PENDING',
      url: undefined,
    };

    const makeRequest = this.http.post(
      url,
      formData,
      { reportProgress: true, observe: 'events' }
    ).pipe(
      delay(1000),
      filter(event => event.type === HttpEventType.UploadProgress ||
        event.type === HttpEventType.Response),
      // prevent passing in events of type upload progress if the total is not valid value
      filter(event => !(event.type === HttpEventType.UploadProgress && !event.total)),
      map((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress: UploadProgress = {
            // @ts-ignore
            progress: Math.round((100 * event.loaded) / event.total),
            state: 'IN_PROGRESS',
          };
          return progress;
        }
        // (event.type === HttpEventType.Response) {
        const done: UploadProgress = {
          progress: 100,
          state: 'DONE',
          url: `http://localhost:5000/files/${fileToUpload.name}`,
        };
        return done;
      }),
      // catchError(this.handleError),
    );

    return merge(of(initialProgress), makeRequest);
  }

}

