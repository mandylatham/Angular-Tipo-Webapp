import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  Renderer2,
  ElementRef,
  Input,
  ViewChild,
  forwardRef,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
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
import { MatFormFieldControl, MatDialogRef } from '@angular/material';

import { MAT_DIALOG_DATA } from '@angular/material';
// import { Logger } from '@app/common';
import { ElementBase } from '../../FormClasses';
import { MatDialog } from '@angular/material';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
// import { switchMap } from 'rxjs/operators';
import { RequestOptions, ResponseContentType } from '@angular/http';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl
} from '@angular/platform-browser';

@Component({
  selector: 'tp-file-image-preview',
  templateUrl: './tpFileImagePreview.component.html',
  styleUrls: ['./tpFileImagePreview.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => TpFileImagePreviewComponent)
    }
  ]
})
export class TpFileImagePreviewComponent implements OnInit {
  public src = '';
  public type = '';
  public d: any;
  public fileData: any;
  public res: any;
  public pdfData: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public httpClient: HttpClient,
    public domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const _this = this;
    console.log('data recieved by the modal', this.data);
    this.src = this.data.src;
    this.type = this.data.type;
    this.getData();
  }

  getData() {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    });
    const _this = this;
    this.httpClient.get(this.src, { responseType: 'blob' }).subscribe(res => {
      const dataUrl = URL.createObjectURL(res);
      _this.fileData = _this.domSanitizer.bypassSecurityTrustUrl(dataUrl);
      _this.pdfData = _this.fileData.changingThisBreaksApplicationSecurity;
      _this.res = res;
    });
  }

  onContainerClick() {}
}
