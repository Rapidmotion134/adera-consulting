import { inject, InjectionToken } from '@angular/core';
import { InMemoryFileUploadService } from './in-memory-file-upload.service';
import { IFileUploadService } from './file-upload.service.interface';
import { HttpClient } from '@angular/common/http';
import { FileUploadService } from './file-upload.service';
import {environment} from "../../../environments/environment";

export const FILE_UPLOAD_SERVICE = new InjectionToken<IFileUploadService>(
  'IFileUploadService',
  {
    providedIn: 'root',
    factory: () => {
      if (environment.implementation === 'IN_MEMORY') {
        return new InMemoryFileUploadService(inject(HttpClient));
      } else {
        return new FileUploadService(inject(HttpClient));
      }
    },
  }
);

export const BASE_URL = new InjectionToken<string>(
  'file-upload-service.base-url',
  {
    providedIn: 'root',
    factory: () => environment.baseUrl,
  }
);
