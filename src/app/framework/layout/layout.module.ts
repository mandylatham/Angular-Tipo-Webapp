import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { TipoComponentsModule } from '../../tipocomponents/tipocomponents.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { DashboardRoutingModule } from './dashboard/dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, MaterialModule, TipoComponentsModule, RouterModule, DashboardRoutingModule],
  declarations: [HeaderComponent, LayoutComponent, DashboardComponent]
})
export class LayoutModule { }
