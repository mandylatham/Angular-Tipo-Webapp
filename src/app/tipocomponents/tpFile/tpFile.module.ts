
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TpFileComponent } from './tpFile.component';
import { TpFileDialogContentComponent } from './tpFileDialogContent/tpFileDialogContent.component';
import { MaterialModule } from './../../material.module';
import { FormsModule } from '@angular/forms';
import { FineUploaderComponent } from './fineUploader/fineUploader.component';
import { TpFileViewComponent } from './tpFileView/tpFileView.component';
import { TpFileImagePreviewComponent } from './tpFileImagePreview/tpFileImagePreview.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';



@NgModule({
  declarations: [
    TpFileComponent,
    TpFileDialogContentComponent,
    FineUploaderComponent,
    TpFileViewComponent,
    TpFileImagePreviewComponent
  ],
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    PdfViewerModule
  ],
  entryComponents: [
    TpFileDialogContentComponent,
    TpFileImagePreviewComponent
  ],
  exports: [
    TpFileComponent,
    TpFileDialogContentComponent,
    FineUploaderComponent,
    TpFileViewComponent,
    TpFileImagePreviewComponent
  ],
  providers: []
})
export class TpFileModule {}


/*
Usage: in the ts file:
 public files = ['public/uploads/1518960572793-1518960572792.jpg',
 'public/uploads/My+workflow.txt' ,
  'public/uploads/CT20182469714_Application.pdf'];
  public multiple = 'true';
  public imageonly = 'false';
  public targetFolder = 'mypics';
  public privateFile = 'true';



In the html file
  <app-tp-file-component
[mode]="'view'"
[(ngModel)]="files"
[isarray]="multiple"
[imageonly]="imageonly"
[targetFolder]="targetFolder"
[privateFile]="privateFile"
></app-tp-file-component>

*/
