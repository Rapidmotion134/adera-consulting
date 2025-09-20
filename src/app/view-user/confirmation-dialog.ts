import {
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
