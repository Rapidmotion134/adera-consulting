import { Observable } from 'rxjs';

export interface IFileUploadService {
    upload(fileToUpload: File): Observable<UploadProgress>;
}


export interface UploadProgress {
    state: 'PENDING' | 'IN_PROGRESS' | 'DONE';
    progress: number;
    url?: string;
}
