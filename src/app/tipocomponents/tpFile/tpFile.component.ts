

import { Component, OnInit, Optional, Inject, Input, ViewChild, forwardRef, Self } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgControl,
  ControlValueAccessor,
  NgModel,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { Logger } from '@app/common';
import { ElementBase } from '../FormClasses';
import { MatDialog } from '@angular/material';
import { MetadataService } from '@app/common';
import { TpFileDialogContentComponent } from './tpFileDialogContent/tpFileDialogContent.component';

@Component({
  selector: 'tp-file-component',
  templateUrl: './tpFile.component.html',
  styleUrls: ['./tpFile.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => TpFileComponent)
    }]
})
export class TpFileComponent  extends ElementBase<any> implements OnInit {

  @ViewChild(NgModel) model: NgModel;
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public allowedvalues: any[];
  @Input() public mode: string;
  @Input() public isarray: string;
  @Input() public metaData: string;
  @Input() public fieldPath: string;
  @Input() public targetFolder: string;
  @Input() public imageonly: string;
  @Input() public privateFile: string;
  @Input() public readOnly: string;
  public files: any = [];
  public filesList: any = [];
  public multipleFiles: boolean;
  public imageOnly: boolean;
  public basePath: string;
  public imageSrc: any;
  public headPath: string;
  public endPath: string;
  public userName: string;
  public appName: string;
  public fineUploaderConfig: any;
  public s3_url: string;
  public domainUrl: string;
  public uploadBucket: string;
  onChange = (_) => {};
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: any) {}
  writeValue(value: any) {
    if (value) {
      for (let i = 0; i < value.length; i++) {
        this.files.push(value[i]);
      }
      this.onChange(this.files);
    }
  }

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    @Optional() @Self() public ngControl: NgControl,
    public dialog: MatDialog,
    public metaDataService: MetadataService
  ) {
    super(validators, asyncValidators, ngControl);
  }

  ngOnInit() {
    this.fineUploaderConfig = {
      signatureEndpoint: '/api/tiposigns3request/',
      version: 4,
      acl: 'public-read',
    };

      const res = this.metaDataService.app_meta_data;
      this.fineUploaderConfig.upload_bucket = res['TipoConfiguration'].aws_settings.upload_bucket;
      this.uploadBucket = res['TipoConfiguration'].aws_settings.upload_bucket;
      this.fineUploaderConfig.region = res['TipoConfiguration'].aws_settings.region;
      this.userName = res['TipoConfiguration'].application_owner_account_name;
      this.appName = res['TipoConfiguration'].application_name;
      this.fineUploaderConfig.accessKey = res['TipoConfiguration'].aws_settings.user_bucket_access_key;
      this.s3_url = res['TipoConfiguration'].aws_settings.s3_url;
      this.fineUploaderConfig.requestEndpoint = this.s3_url + '/' + this.fineUploaderConfig.upload_bucket;
      this.domainUrl = this.fineUploaderConfig.requestEndpoint + '/' + this.userName + '/' + this.appName + '/';
      this.init();
  }

  init() {

    this.headPath = this.userName + '/' + this.appName + '/';
    if (this.isarray === 'true') {
      this.multipleFiles = true;
    } else {
      this.multipleFiles = false;
    }
    if (this.imageonly === 'true') {
      this.imageOnly = true;
    } else {
      this.imageOnly = false;
    }
    if (this.privateFile === 'true') {
      this.endPath = 'private/' + this.uuid4() + '/';
      this.basePath = this.headPath + this.endPath;
    } else {
      this.endPath = 'public/uploads/';
      this.basePath = this.headPath + this.endPath;
    }
    if (this.targetFolder) {
      this.endPath = this.endPath + this.targetFolder + '/';
      this.basePath = this.basePath + this.targetFolder + '/';
    }
  }

  onContainerClick() {
  }

  onDeleteFile(event) {
    this.filesList.splice(event, 1);
  }

  displayImage(event: Event) {
    console.log(event);
    const eventTarget: any = event.target;
    if (eventTarget.files && eventTarget.files[0]) {
      const file = eventTarget.files[0];
      const reader = new FileReader();
      reader.onload = (e => this.imageSrc = reader.result).bind(this);
      reader.readAsDataURL(file);
    }
  }

  showFileUploadConsole() {
    const _this = this;
    const fileConsoleRef = this.dialog.open(TpFileDialogContentComponent, {
      width: '60%',
      maxHeight: '500px',
      data: {
        multiple: this.multipleFiles,
        imageonly: this.imageonly,
        basePath: this.basePath,
        endPath: this.endPath,
        fineUploaderConfig: this.fineUploaderConfig
      }
    });

    fileConsoleRef.afterClosed().subscribe(result => {
      for (let i = 0; i < result.length; i++) {
        if ( result[i].status === 'upload successful') {
            const fileName = result[i].name;
            this.files.push(this.endPath + fileName);
        }
      }
      _this.onChange(_this.files);
    });
  }

  uuid4() {
    //// return uuid of form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    let uuid = '';
    let ii;
    for (ii = 0; ii < 32; ii += 1) {
      switch (ii) {
        case 8:
        case 20:
          uuid += '_';
          uuid += (Math.random() * 16 | 0).toString(16);
          break;
        case 12:
          uuid += '_';
          uuid += '4';
          break;
        case 16:
          uuid += '_';
          uuid += (Math.random() * 4 | 8).toString(16);
          break;
        default:
          uuid += (Math.random() * 16 | 0).toString(16);
      }
    }
    return uuid;
  }
}
