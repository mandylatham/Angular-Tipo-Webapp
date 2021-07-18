import { Component, Inject, Injector, OnInit, ChangeDetectorRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TipoDirectivesModule } from '@app/tipodirectives';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';
import { IDynamicRemoteTemplateFactory, DynamicHttpResponseT, IDynamicHttpRequest } from '@app/tipodynamicloading';

 interface TpActions {
  name: string;
  icon: string;
  action_name: string;
 }
interface TpData {
  title: string;
  template: string;
  actions: TpActions[];
  context: any;
  tipoHandle: any;
}

@Component({
  selector: 'tp-dialog',
  templateUrl: './tp-dialog.component.html',
  styleUrls: ['./tp-dialog.component.css']
})
export class TpDialogComponent implements OnInit  {
  context: any = this;
  tipo: any;
  myTemplate: string;
  extraModules =  [FormsModule, FlexLayoutModule, MaterialModule,
                   ReactiveFormsModule, this._injector.get('TipoComponentsModule'), TipoDirectivesModule, NgxDatatableModule];
  constructor(
    fb: FormBuilder,
    route: ActivatedRoute,
    cd: ChangeDetectorRef,
    private _injector: Injector,
    public dialogRef: MatDialogRef<TpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TpData) {
      this.context = data.context;
      this.myTemplate = 'g/public/gen_temp/common/views/' + data.template;
    }

    remoteTemplateFactory: IDynamicRemoteTemplateFactory = {
      // This is an optional method
      buildRequestOptions (): IDynamicHttpRequest {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'text/html');

        return {
          headers: headers
        };
      },
      // This is an optional method
      parseResponse (response: DynamicHttpResponseT): string {
        let template = response.toString();
        const indexReplacements = this.context.context['indexReplacements'];
        if (indexReplacements.length <= 0) {
          return template;
        }
        _.each(indexReplacements, function(each) {
          template = template.replace(new RegExp(' ' + each['index_name'] + ' ', 'g'), each['index']);
        });
        return template;
      },
      context: this.context
    };

    closeDialog() {
      this.dialogRef.close(this.context);
    }

    ngOnInit() {
  }

}
