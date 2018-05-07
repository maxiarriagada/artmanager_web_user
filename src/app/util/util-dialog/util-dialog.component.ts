import { Component, OnInit, Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-util-dialog',
  templateUrl: './util-dialog.component.html',
  styleUrls: ['./util-dialog.component.css']
})
export class UtilDialogComponent implements OnInit {
 

  constructor(
    public dialogRef: MatDialogRef<UtilDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){}

  onNoClick(): void {
    console.log('onNoClick');
    this.dialogRef.close();
  }

  ngOnInit() {
  }
}
