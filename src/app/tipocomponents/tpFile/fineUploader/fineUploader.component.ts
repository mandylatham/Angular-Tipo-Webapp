import {
  Component,
  OnInit,
  Renderer2,
  Optional,
  Inject,
  Input,
  OnDestroy,
  ViewChild,
  forwardRef,
  Self,
  Output
} from '@angular/core';
// import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

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
// import { map } from 'rxjs/operators';
import { MatFormFieldControl } from '@angular/material';
import qq from 'fine-uploader/lib/s3';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'tp-fine-uploader',
  templateUrl: './fineUploader.component.html',
  styleUrls: ['./fineUploader.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => FineUploaderComponent)
    }
  ]
})
export class FineUploaderComponent implements OnInit , OnDestroy {
  @ViewChild(NgModel)
  model: NgModel;
  public uploader: any;
  public acceptFiles: any;
  public allowedExtensions: any;
  private credentials: any;
  @Input() public basePath: string;
  @Input() public multiple;
  @Input() public imageonly;
  @Input() public fineUploaderConfig;
  @Output() public allFiles: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document
  ) { }

  ngOnInit() {
    // console.log('this.fineUploaderConfig inside fineUpladoer', this.fineUploaderConfig);
    // render the file upload console
    if (this.imageonly === 'true') {
      this.acceptFiles = 'image/*';
      this.allowedExtensions = ['jpg', 'png', 'jpeg', 'PNG'];
    } else {
      this.acceptFiles = 'file_extension';
      this.allowedExtensions = ['*'];
    }
    const credsstr = localStorage.getItem('security_context');
    this.credentials = JSON.parse(credsstr);
    this.renderFineUploader();
    this.loadFineUploader();
  }

  ngOnDestroy() {
    this.allFiles.emit(this.uploader.getUploads());
  }

  loadFineUploader() {
    const _this = this;
    this.uploader = new qq.s3.FineUploader({
      element: document.getElementById('uploader'),
      request: {
        endpoint: _this.fineUploaderConfig.requestEndpoint,
        accessKey: _this.fineUploaderConfig.accessKey
      },
      cors: {
        expected: true,
        allowXdr: true
      },
      signature: {
        endpoint: _this.fineUploaderConfig.signatureEndpoint,
        version: 4,
        customHeaders: {'authorization': _this.credentials.accessToken}
      },
      objectProperties: {
        acl: _this.fineUploaderConfig.acl,
        bucket: _this.fineUploaderConfig.upload_bucket,
        region: _this.fineUploaderConfig.region,
        key: function (fileId) {
          return _this.basePath + this.getName(fileId);
        }
      },
      // uploadSuccess: {
      //   endpoint: '/s3/success'
      // },
      iframeSupport: {
        localBlankPagePath: '/success.html'
      },
      chunking: {
        enabled: true,
        concurrent: {
          enabled: true
        }
      },
      autoUpload: false
      ,
      multiple: this.multiple,
      resume: {
        enabled: true
      },
      retry: {
        enableAuto: true,
        showButton: true
      },
      validation: {
        acceptFiles: _this.acceptFiles,
        allowedExtensions: _this.allowedExtensions
      },
      extraButtons: [
        {
          element: document.getElementById('manualBBrowseButton'),
        }
      ],
      callbacks: {
        onSubmit: function (id, name) {
          const uploads = _this.uploader.getUploads();
          _this.allFiles.emit(uploads);
        },
        onCancel: function (id, name) {
          const uploads = _this.uploader.getUploads();
          _this.allFiles.emit(uploads);
        },
        onCancelComplete: function (id, name) {
          const uploads = _this.uploader.getUploads();
          _this.allFiles.emit(uploads);
        },
        // onSubmitDelete: function (id, name) {
        //   const uploads = _this.uploader.getUploads();
        //   _this.allFiles.emit(uploads);
        // },
        onSatusChange: function (id, pre, cur) {
          // if (cur === 'deleted' || cur === 'canceled' || cur === 'rejected') {
            const uploads = _this.uploader.getUploads();
            _this.allFiles.emit(uploads);
          // }
        },
        onDelete: function (id) {
          const uploads = _this.uploader.getUploads();
          _this.allFiles.emit(uploads);
        },
        // onDeleteComplete: function (id, req, err) {
        //   if (!err) {
        //     const uploads = _this.uploader.getUploads();
        //     _this.allFiles.emit(uploads);
        //   }
        // }
      }
    });


  }



  startUpload() {
    this.uploader.uploadStoredFiles();
  }


  removeAllFiles() {
    this.uploader.cancelAll();
  }

  renderFineUploader() {
    const s: any = this._renderer2.createElement('script');
    s.type = 'text/template';
    s.id = 'qq-template';
    s.text = `<div class="qq-uploader-selector qq-uploader qq-gallery" qq-drop-area-text="Drop files here">
      <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
          <div role="progressbar"
           aria-valuenow="0"
           aria-valuemin="0" aria-valuemax="100" class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
      </div>
      <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>
          <span class="qq-upload-drop-area-text-selector"></span>
      </div>

      <span class="qq-drop-processing-selector qq-drop-processing">
          <span>Processing dropped files...</span>
          <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>
      </span>
      <ul class="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite" aria-relevant="additions removals">
          <li>
              <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>
              <div class="qq-progress-bar-container-selector qq-progress-bar-container">
                  <div role="progressbar"
                   aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>
              </div>
              <span class="qq-upload-spinner-selector qq-upload-spinner"></span>
              <div class="qq-thumbnail-wrapper">
                  <img class="qq-thumbnail-selector" qq-max-size="120" qq-server-scale>
              </div>
              <button type="button" class="qq-upload-cancel-selector qq-upload-cancel">X</button>
              <button type="button" class="qq-upload-retry-selector qq-upload-retry">
                  <span class="qq-btn qq-retry-icon" aria-label="Retry"></span>
                  Retry
              </button>

              <div class="qq-file-info">
                  <div class="qq-file-name">
                      <span class="qq-upload-file-selector qq-upload-file"></span>
                      <span class="qq-edit-filename-icon-selector qq-btn qq-edit-filename-icon" aria-label="Edit filename"></span>
                  </div>
                  <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">
                  <span class="qq-upload-size-selector qq-upload-size"></span>
                  <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">
                      <span class="qq-btn qq-delete-icon" aria-label="Delete"></span>
                  </button>
                  <button type="button" class="qq-btn qq-upload-pause-selector qq-upload-pause">
                      <span class="qq-btn qq-pause-icon" aria-label="Pause"></span>
                  </button>
                  <button type="button" class="qq-btn qq-upload-continue-selector qq-upload-continue">
                      <span class="qq-btn qq-continue-icon" aria-label="Continue"></span>
                  </button>
              </div>
          </li>
      </ul>

      <dialog class="qq-alert-dialog-selector">
          <div class="qq-dialog-message-selector"></div>
          <div class="qq-dialog-buttons">
              <button type="button" class="qq-cancel-button-selector">Close</button>
          </div>
      </dialog>

      <dialog class="qq-confirm-dialog-selector">
          <div class="qq-dialog-message-selector"></div>
          <div class="qq-dialog-buttons">
              <button type="button" class="qq-cancel-button-selector">No</button>
              <button type="button" class="qq-ok-button-selector">Yes</button>
          </div>
      </dialog>

      <dialog class="qq-prompt-dialog-selector">
          <div class="qq-dialog-message-selector"></div>
          <input type="text">
          <div class="qq-dialog-buttons">
              <button type="button" class="qq-cancel-button-selector">Cancel</button>
              <button type="button" class="qq-ok-button-selector">Ok</button>
          </div>
      </dialog>
  </div>`;
    // </script>

    this._renderer2.appendChild(this._document.body, s);
  }

}
