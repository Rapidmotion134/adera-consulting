import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getDownloadUrl(fileKey: string) {
    this.http.get(
      `${this.baseUrl}upload/${fileKey}`,
      {
        responseType: 'blob' as const, // Properly typed for blob response
        observe: 'response' // To get full response including headers
      }
    ).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = fileKey.split('/').pop() || 'downloaded-file';

        // Extract filename from Content-Disposition header if available
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }

        const blobUrl = window.URL.createObjectURL(response.body as Blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
        }, 100);
      },
      error: (error) => console.error('Download error:', error),
    });
  }
}
