

import { Component, OnInit, OnDestroy, Renderer2, ElementRef, Input, ViewChild, forwardRef, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgControl,
  NgModel,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS
} from '@angular/forms';
import saveAs from 'file-saver';
import { MatFormFieldControl, MatDialogRef } from '@angular/material';
// import { Logger } from '@app/common';
import { ElementBase } from '../../FormClasses';
import { MatDialog } from '@angular/material';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { TpFileImagePreviewComponent } from './../tpFileImagePreview/tpFileImagePreview.component';
import { Event } from '@angular/router';

// import { saveAs } from 'file-saver/FileSaver';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'tp-file-view',
  templateUrl: './tpFileView.component.html',
  styleUrls: ['./tpFileView.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => TpFileViewComponent)
    }],
})
export class TpFileViewComponent implements OnInit {

  @Input() files: any = [];
  @Input() domainUrl: string;
  @Input() mode: string;
  @Input() userName: string;
  @Input() appName: string;
  @Input() bucket: string;
  public modal: any;
  public modalImg: any;
  public span: any;
  public accessKey: string;
  public fullUrl: string;
  @Output() deleteFile: EventEmitter<any> = new EventEmitter<any>();
  public imageExtensions = ['jpg', 'png', 'PNG', 'JPEG'];


  constructor(public dialog: MatDialog, public http: HttpClient) {
  }

  ngOnInit() {
  this.accessKey = JSON.parse(localStorage.getItem('security_context')).accessToken;
  }

  onContainerClick() {

  }

  imagePreview(file) {
    const _this = this;
    this.getSignedUrl(file).subscribe((res: any) => {
      const dialogRef = this.dialog.open(TpFileImagePreviewComponent, {
        height: 'auto',
        width: 'auto',
        panelClass: 'custom-dialog',
        data: { src: decodeURIComponent(res.signedurl), type: 'img' },
      });
    });
  }

  getFileNameFromUrl(fileUrl) {
    return fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
  }

  saveFile = (blobContent: Blob, fileName: string) => {
    const blob = new Blob([blobContent], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  }

  downloadThisFile(fileUrl) {
    const _this = this;
    this.getSignedUrl(fileUrl).subscribe((res: any) => {
      const options = new RequestOptions({ responseType: ResponseContentType.Blob });
      this.http.get(decodeURIComponent(res.signedurl), { responseType: 'blob' }).subscribe(response => {
        _this.saveFile(response, _this.getFileNameFromUrl(fileUrl));
      });
    });
  }

  pdfPreview(file) {
    const _this = this;
    this.getSignedUrl(file).subscribe((res: any) => {
      const dialogRef = this.dialog.open(TpFileImagePreviewComponent, {
        height: '80%',
        width: 'auto',
        panelClass: 'pdf-dialog',
        data: { src: decodeURIComponent(res.signedurl), type: 'pdf' },
      });
    });
  }

  onDeleteFile(id) {
    this.deleteFile.emit(id);
  }

  isImage(file) {
    const ext = this.getExtension(file);
    for (let i = 0; i < this.imageExtensions.length; i++) {
      if (this.imageExtensions[i] === ext) {
        return true;
      }
    }
    return false;
  }

  isPdf(file) {
    const ext = this.getExtension(file);
    if (ext === 'pdf' || ext === 'PDF') {
      return true;
    } else {
      return false;
    }
  }

  isImageOrPdf(file) {
    if (this.isImage(file) === true || this.isPdf(file) === true) {
      return true;
    } else {
      return false;
    }
  }

  onCloseImagePreview() {
    this.modal.style.display = 'none';
  }


  getExtension(filename) {
    // console.log('get extension function has been called with ', filename);
    return filename.split('.').pop();
  }

  getSignedUrl(endPoint) {
    console.log(`/${this.userName}/${this.appName}/${endPoint}`);
    const headers = new HttpHeaders({
      'authorization': this.accessKey
    });
    const postBody = {
      'bucket': 'dev.upload.tipotapp.tipotapp.com',
      'key': `${this.userName}/${this.appName}/${endPoint}`
  };
  return this.http.post('/api/tipogetpresignedurl', postBody , {headers: headers} );
  }

}
