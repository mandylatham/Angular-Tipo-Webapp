import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


interface ConfirmationData {
  title: string;
  message: string;
}

@Component({
  selector: 'tp-confirmation-dialog',
  templateUrl: './tp-confirmation-dialog.component.html',
  styleUrls: ['./tp-confirmation-dialog.component.scss']
})
export class TpConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<TpConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
