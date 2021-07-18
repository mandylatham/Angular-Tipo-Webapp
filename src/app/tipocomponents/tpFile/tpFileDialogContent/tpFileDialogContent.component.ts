

import { Component,
  OnInit, Inject , OnDestroy, Renderer2, ElementRef, Input, ViewChild, forwardRef, Output, EventEmitter} from '@angular/core';
import { FormGroup,
  FormBuilder,
   Validators,
   NgControl,
    NgModel,
     NG_VALUE_ACCESSOR,
      NG_VALIDATORS,
       NG_ASYNC_VALIDATORS
 } from '@angular/forms';
import {MatFormFieldControl , MatDialogRef , MAT_DIALOG_DATA} from '@angular/material';
// import { Logger } from '@app/common';
import { ElementBase } from '../../FormClasses';
import {MatDialog} from '@angular/material';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { FineUploaderComponent } from './../fineUploader/fineUploader.component';

@Component({
  selector: 'tp-file-dialog-content',
  templateUrl: './tpFileDialogContent.component.html',
  styleUrls: ['./tpFileDialogContent.component.scss'],
  providers: [
  {
    provide: MatFormFieldControl,
    useExisting: forwardRef(() => TpFileDialogContentComponent)
  }],
})
export class TpFileDialogContentComponent implements OnInit , OnDestroy {


  public pathString = '';
  public basePath = 'public';
  public myModel: NgModel;
  public files: any = [];
  public multipleFiles: any;
  public imageonly: boolean;
  public fineUploaderConfig: any;
  public endPath: string;
  @Output() filesList: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(FineUploaderComponent) fineUploader;


  constructor(public dialogRef: MatDialogRef<TpFileDialogContentComponent> , @Inject(MAT_DIALOG_DATA) public data: any ) {
  }

  ngOnInit() {
    this.multipleFiles = this.data.multiple;
    this.imageonly = this.data.imageonly;
    this.basePath = this.data.basePath;
    this.endPath = this.data.endPath;
    this.fineUploaderConfig = this.data.fineUploaderConfig;
  }

  ngOnDestroy(): void {
    this.closeDialog();
  }


  onContainerClick() {

  }

  removeAllFiles() {
    this.fineUploader.removeAllFiles();
  }


  onStartUpload() {
    this.fineUploader.startUpload();
  }

  closeDialog() {
    this.dialogRef.close(this.files);
  }

  onBrowseFileClicked() {
  }

  allFilesRecieved(files) {
    this.files = files;
    this.pathString = '';
    for ( let i = 0 ; i < files.length; i++) {
      console.log('file status' , files[i].status);
      if (files[i].status === 'submitting' ||
       files[i].status === 'submitted' ||
        files[i].status === 'uploading' ||
         files[i].status === 'upload successful') {
        const filename = files[i].name;
        this.pathString = this.pathString + ' ' + this.endPath + filename;
      }
    }
  }


}
