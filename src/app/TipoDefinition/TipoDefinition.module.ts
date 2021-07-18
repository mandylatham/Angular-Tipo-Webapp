import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';
import { TipoComponentsModule } from '@app/tipocomponents';
import { TipoDirectivesModule } from '@app/tipodirectives';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TipodefinitionComponent } from './tipodefinition.component';




@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxDatatableModule,
    TipoComponentsModule,
    TipoDirectivesModule],
  providers: [
    {
      provide: 'widgets',
      useValue: {
        name: 'TipodefinitionComponent',
        component: TipodefinitionComponent
      }
    }
  ],
  declarations: [TipodefinitionComponent],
  entryComponents: [TipodefinitionComponent]
})
export class TipoDefinition { }


