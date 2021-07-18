import {
  AfterViewInit, ChangeDetectorRef, Component, Input,
  OnChanges, OnInit, ViewContainerRef, ViewChild,
  Injector, NgModuleFactoryLoader, ComponentFactoryResolver, Compiler
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Logger } from '@app/common';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TipoComponentsModule } from '@app/tipocomponents';
import { TipoDirectivesModule } from '@app/tipodirectives';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TipoManipulationService, TipoHandleService, TipoStateService } from '@app/framework/services';
import { IDynamicRemoteTemplateFactory, DynamicHttpResponseT, IDynamicHttpRequest } from '@app/tipodynamicloading';



const log = new Logger('TipoInstanceComponent');

export interface IndexReplacement {
  index_name: string;
  index: number;
}

@Component({
  selector: 'tp-instance',
  templateUrl: './tipoinstancetest.html',
  styleUrls: ['./tipoinstance.component.scss']
})
export class TipoInstanceComponent implements OnChanges, OnInit, AfterViewInit {
  @Input()
  sidenav: MatSidenav;
  context: any = this;
  perspectives: any[];
  tipo_json: any[];
  tipoForm: FormGroup;
  dialogForm: FormGroup;
  tipo: any;
  mode: string;
  tipo_name: string;
  showIntercom: Boolean = false;
  hide_actions: Boolean = false;
  _: any;
  cloned_tipo_id: string;
  menu_label: any = 'test';
  popupno = 0;
  myTemplate: string;
  indexReplacements: IndexReplacement[] = [];
  extraModules = [FormsModule, FlexLayoutModule, MaterialModule,
    ReactiveFormsModule, TipoComponentsModule, TipoDirectivesModule, NgxDatatableModule];

  @ViewChild('vc', { read: ViewContainerRef }) vc;
  constructor(fb: FormBuilder,
    route: ActivatedRoute,
    private tipo_manipulation: TipoManipulationService,
    private tipo_handle: TipoHandleService,
    private tipo_state: TipoStateService,
    cd: ChangeDetectorRef,
    private _injector: Injector,
    private _compiler: Compiler,
    private loader: NgModuleFactoryLoader,
    private _resolver: ComponentFactoryResolver,
    private http: HttpClient,
  ) {
    this.tipo_json = route.snapshot.data.tipo_json;
    this.tipo_name = route.snapshot.params.tipo_name;
    this.tipo = route.snapshot.data.tipo;
    // this.tipo = this.tipo_json['json'];
    this.tipoForm = this.tipo_json['form'];
    this.cloned_tipo_id = route.snapshot.params.copyFrom;
    this._ = _;
    const routeConfig = route.routeConfig;
    if (route.snapshot.params.tipo_name && route.snapshot.params.tipo_id && route.snapshot.url.length === 4) {
      this.mode = 'edit';
      this.tipoForm.patchValue({tipo: this.tipo});
      this.myTemplate = 'https://dev.tipotapp.com.au/' + this.tipo_handle.updateUrl(this.tipo_name);
    } else if (route.snapshot.params.tipo_name && route.snapshot.params.tipo_id) {
      this.mode = 'view';
      this.tipoForm.patchValue({tipo: this.tipo});
      this.myTemplate = 'https://dev.tipotapp.com.au/' + this.tipo_handle.detailUrl(this.tipo_name);
    } else {
      this.mode = 'create';
      this.myTemplate = 'https://dev.tipotapp.com.au/' + this.tipo_handle.createUrl(this.tipo_name);
    }
    // this.http.get('https://dev.tipotapp.com.au/' + this.tipo_handle.createUrl(this.tipo_name))
    //           .pipe(map((html: any) => {
    //             this.myTemplate = html;
    //           }));
  }

  remoteTemplateFactory: IDynamicRemoteTemplateFactory = {
    // This is an optional method
    buildRequestOptions(): IDynamicHttpRequest {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'text/html');

      return {
        headers: headers
      };
    },
    // This is an optional method
    parseResponse(response: DynamicHttpResponseT): string {
      const template = response.toString();
      return template;
    }
  };

  addModule = () => {
    // const headers = new HttpHeaders().set('Content-Type', 'text/javascript');
    // this.http.get('http://localhost:4200/assets/test-tipo.js', {responseType: 'text'})
    //   .subscribe((moduleFactory: any) => {
    //     this._compiler.compileModuleAsync(moduleFactory)
    //     .then((factory) => {
    //           const module = factory.create(this._injector);
    //           const cfr = module.componentFactoryResolver;
    //           const widgets = module.injector.get('widgets');
    //           const cmpFactoty = cfr.resolveComponentFactory(widgets.component);
    //           this.vc.createComponent(cmpFactoty);
    //         });
    //    });
    // this._compiler.compileModuleAsync(moduleFactory)
    // .then((factory) => {
    //       const module = factory.create(this._injector);
    //       const cfr = module.componentFactoryResolver;
    //       const widgets = module.injector.get('widgets');
    //       const cmpFactoty = cfr.resolveComponentFactory(widgets.component);
    //       this.vc.createComponent(cmpFactoty);
    //     });
    // const dynamicModule =  `src/app/${this.tipo_name}/${this.tipo_name}.module#${this.tipo_name}Module`;
    // this.loader.load('assets/test-tipo.js')
    //   .then((factory) => {
    //     const module = factory.create(this._injector);
    //     const cfr = module.componentFactoryResolver;
    //     const widgets = module.injector.get('widgets');
    //     const cmpFactoty = cfr.resolveComponentFactory(widgets.component);
    //     this.vc.createComponent(cmpFactoty);
    //   });
    // const templateUrl = 'https://dev.tipotapp.com.au/' + this.tipo_handle.createUrl(this.tipo_name);
    // const tmpCmp = Component({
    //     moduleId: module.id, templateUrl
    //   })(  class { });
    // const cmpFactory = this._resolver.resolveComponentFactory(tmpCmp);
    // this.vc.createComponent(cmpFactory);
  }


  tipoHandle = () => {
    return {
      menu_item: {},
      menu_label: ''
    };
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.addModule();
  }

  ngOnChanges(changes) {
    log.debug('changes', changes);
  }

  copyFromFilter = (encodedFilter) => {
    log.debug('copyFromFilter', atob(encodedFilter));
  }

  onSubmit = () => {
    log.debug('form', this.tipoForm);
    let clone_tipo = _.cloneDeep(this.tipoForm.value.tipo);
    clone_tipo = this.tipo_manipulation.modifyTipoData(clone_tipo);
    if (this.mode === 'edit') {
      this.tipo_handle.saveTipo(this.tipo_name, clone_tipo.tipo_id, clone_tipo);
    } else {
      const perspectiveMetadata = this.tipo_state.perspectiveMetaData;
      if (perspectiveMetadata.field_name && !clone_tipo[perspectiveMetadata.field_name]) {
        clone_tipo[perspectiveMetadata.field_name] = perspectiveMetadata.tipo_id;
      }
      if (!_.isUndefined(this.cloned_tipo_id)) {
        clone_tipo.copy_from_tipo_id = this.cloned_tipo_id;
      }
      this.tipo_handle.createTipo(this.tipo_name, clone_tipo)
                      .subscribe((result) => {
                        this.tipo_state.toTipoResponse([result], this.tipo_name, result.tipo_id, {});
                      });
    }
  }

  cancel = () => {
    log.debug('Cancel', this.tipoForm);
  }

  addFieldArray = (string, event) => {
    event.preventDefault();
    const fieldarray = this.tipoForm.get('tipo.' + string) as FormArray;
    fieldarray.push(this.tipo_manipulation.jsonToFormGroup(_.get(this.tipo_json['json'], `${string}.0`)));
    if (fieldarray) {

    } else {
    }
  }

  showdetail = (template_name, fq_field_name, index_field_name, event) => {
    event.preventDefault();
    this.popupno++;
    const fields = fq_field_name.split('.');
    const inx_fields = index_field_name.split('.');
    if (_.isUndefined(this.tipo)) {
      this.tipo = {};
    }
    const indexReplacements = [];
    _.each(fields, function (field, inx) {
      if (field !== inx_fields[inx]) {
        indexReplacements.push({
          index_name: inx_fields[inx],
          index: field
        });
      }
    });
    this.indexReplacements = indexReplacements;
    // _.each(fields, function (field) {
    //   if (field.indexOf('[') !== -1) {
    //     const ind1 = field.indexOf('[');
    //     const ind2 = field.indexOf(']');
    //     const inx = field.slice(ind1 + 1, ind2);
    //     const fieldname = field.slice(0, ind1);
    //     const regex = new RegExp(fieldname + '([\\[(])(.+?)([\\])])', 'g');
    //     template = template.replace(regex, fieldname + '[' + inx + ']');
    //   }
    // });
    this.dialogForm = this.tipoForm.get('tipo.' + fq_field_name) as FormGroup;
    this.tipo_handle.presentDialogForm('Tipo',
      template_name,
      { ...this.context, ...this.dialogForm },
      [{ name: 'Submit', action_name: 'Ok' },
      { name: 'Submit', action_name: 'Ok' }])
      .subscribe(result => {
        console.log(result);
        (this.tipoForm.get('tipo.' + fq_field_name) as FormGroup).patchValue(result.context.dialogForm.value);
      });
  }

  deleteItem = (string, index, event) => {
    event.preventDefault();
    const formArray = this.tipoForm.get('tipo.' + string) as FormArray;
    formArray.removeAt(index);
    // Since ngx-datatable binds to immutable objects we have to change the reference of the FormArray to trigger Change Detection
    this.tipoForm.removeControl(string);
    this.tipoForm.setControl(string, formArray);

  }
}
