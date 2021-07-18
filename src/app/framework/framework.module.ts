import { CommonModule } from '@angular/common';
import { NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@app/material.module';
import { TipoComponentsModule } from '@app/tipocomponents';
import { TipoDirectivesModule } from '@app/tipodirectives';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TipoRoutingModule } from './framework-routing.module';
import { LayoutModule } from './layout/layout.module';
import { TipoInstanceComponent } from './tipocontainer/tipoinstancecomponent/tipoinstance.component';
import { TipoListComponent } from './tipocontainer/tipolistcomponent/tipolist.component';
import { TpConfirmationDialogComponent, TpDialogComponent, TpSnackBarComponent} from './dialogs';
import { NgxDynamicTemplateModule } from '@app/tipodynamicloading';




@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxDatatableModule,
    NgxDynamicTemplateModule.forRoot(),
    LayoutModule,
    TipoComponentsModule,
    TipoDirectivesModule,
    TipoRoutingModule],
  providers: [
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    {
      provide: 'TipoComponentsModule',
      useValue: TipoComponentsModule
    },
    {
      provide: 'TipoInstanceComponent',
      useValue: TipoInstanceComponent
    },
  ],
  declarations: [TipoInstanceComponent,
    TipoListComponent,
    TpConfirmationDialogComponent,
    TpDialogComponent,
    TpSnackBarComponent],
  entryComponents: [
    TpConfirmationDialogComponent,
    TpDialogComponent,
    TpSnackBarComponent,
    TipoInstanceComponent
  ]
})
export class TipoFrameworkModule { }
