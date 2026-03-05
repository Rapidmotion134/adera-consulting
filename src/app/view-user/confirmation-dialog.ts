import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {Component, inject} from "@angular/core";
import {MatButton} from "@angular/material/button";

@Component({
    selector: 'confirmation-dialog',
    templateUrl: 'confirmation-dialog.html',
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton]
})
export class ConfirmationDialog {
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  data = inject(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
