import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {Component, inject} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
    selector: 'document-dialog',
    templateUrl: 'view-document-dialog.html',
    styleUrl: 'view-document-dialog.scss',
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton]
})
export class DocumentDialog {
  readonly dialogRef = inject(MatDialogRef<DocumentDialog>);
  data = inject(MAT_DIALOG_DATA);
  protected readonly document = document;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
