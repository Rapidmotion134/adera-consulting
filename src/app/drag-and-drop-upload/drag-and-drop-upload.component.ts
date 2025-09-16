import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {DecimalPipe, NgClass} from "@angular/common";
import {environment} from "../../environments/environment";
import {IFileUploadService, UploadProgress} from "./service/file-upload.service.interface";
import {FILE_UPLOAD_SERVICE} from "./service/file-upload.service.provider";
import {map} from "rxjs/operators";
import {merge, Observable} from "rxjs";

@Component({
    selector: 'app-drag-and-drop-upload',
    imports: [DecimalPipe, NgClass],
    templateUrl: './drag-and-drop-upload.component.html',
    styleUrl: './drag-and-drop-upload.component.scss'
})
export class DragAndDropUploadComponent {

  constructor(
    @Inject(FILE_UPLOAD_SERVICE) private fileUploadService: IFileUploadService
  ) { }

  baseUrl: string = environment.baseUrl;
  url!: string;
  file!: File;
  files: File[] = [];
  acceptedFileTypes: string[] = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png'];
  dragged: boolean = false;
  uploading = false;
  uploadCompletedCount = 0;
  uploadProgresses: UploadProgress[] = [];
  fileUrls: string[] = [];

  @Output() uploadStarted: EventEmitter<File[]> = new EventEmitter();
  @Output() uploadProgress: EventEmitter<{
    index: number;
    progress: UploadProgress;
  }> = new EventEmitter();
  @Output() fileUploaded: EventEmitter<{ index: number; url: string }> =
    new EventEmitter();
  @Output() uploadFinished: EventEmitter<string[]> = new EventEmitter();

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
    event.dataTransfer!.dropEffect = 'copy'; // Specify the drop effect
    this.dragged = true;
  }

  onDragLeave() {
    this.dragged = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
    const droppedFiles = event.dataTransfer?.files; // Get the files from the drop event
    this.dragged = false;
    if (droppedFiles) {
      this.handleFiles(droppedFiles);
    }
  }

  onClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true; // Allow multiple file selection
    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        this.handleFiles(files);
      }
    };
    input.click(); // Trigger click to open file dialog
  }

  private handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file type is accepted
      if (this.isFileTypeAccepted(file)) {
        this.files.push(file); // Add valid files to the array
      } else {
        alert(`File type not accepted: ${file.name}. Accepted types: PDF, DOCX, PNG.`);
      }
    }

    const formData = new FormData();
    for (let i = 0; i < this.files.length; i++) {
      formData.append('files[]', this.files[i]);
    }

    // Upload files to your server endpoint
    this.startUpload();
  }

  startUpload(): void {
    if (this.files.length <= 0) {
      return;
    }
    const progressMap = this.getUploads().map((progress, index) => {
      return progress.pipe(
        map((p) => ({
          index,
          p,
        }))
      );
    });
    merge(...progressMap).subscribe((progress) => {
      this.uploadProgress.emit({ index: progress.index, progress: progress.p });
    });
    this.uploading = true;
    this.uploadStarted.emit(this.files);
  }

  private getUploads(): Observable<UploadProgress>[] {
    return this.files.map(
      (file, index) =>
        this.fileUploadService.upload(file).pipe(
          map((progress) => {
            this.uploadProgresses[index] = progress;
            if (progress.state === 'DONE') {
              this.uploadCompletedCount++;
              if (progress.url != null) {
                this.fileUrls[index] = progress.url;
              }
              this.fileUploaded.emit({
                index,
                url: `${progress.url}`,
              });
            }
            if (this.uploadCompletedCount === this.files.length) {
              this.uploadFinished.emit(this.fileUrls);
              this.file = this.files[0];
              this.cleanUp();
            }
            return progress;
          })
        )
    );
  }

  private cleanUp(): void {
    this.uploading = false;
    this.files = [];
    this.uploadProgresses = [];
    this.uploadCompletedCount = 0;
    this.fileUrls = [];
  }

  private isFileTypeAccepted(file: File): boolean {
    return this.acceptedFileTypes.includes(file.type);
  }
}
