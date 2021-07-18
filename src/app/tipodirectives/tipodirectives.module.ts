import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/material.module';
import { TpResponsiveGridDirective } from './tpResponsiveGrid/tp-responsive-grid.directive';
import { TpResponsiveTileDirective } from './tpResponsiveGrid/tp-responsive-tile.directive';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [TpResponsiveGridDirective, TpResponsiveTileDirective],
  exports: [TpResponsiveGridDirective, TpResponsiveTileDirective]
})
export class TipoDirectivesModule { }
