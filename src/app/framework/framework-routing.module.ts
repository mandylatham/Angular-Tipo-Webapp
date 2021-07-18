import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './layout/layout.service';
import {  TipoJsonResolver, TipoResolver, TiposResolver } from './resolvers';
import { TipoInstanceComponent } from './tipocontainer/tipoinstancecomponent/tipoinstance.component';
import { TipoListComponent } from './tipocontainer/tipolistcomponent/tipolist.component';


// import { extract } from '@app/core';

const routes: Routes = [
  Layout.childRoutes([
    {
      path: 'tipo/:tipo_name',
      component: TipoListComponent,
      resolve: {
        tipos: TiposResolver
      }
    },
    {
      path: 'tipo/:tipo_name/new',
      component: TipoInstanceComponent,
      resolve: {
        tipo_json: TipoJsonResolver
      }
    },
    {
      path: 'tipo/:tipo_name/:tipo_id',
      component: TipoInstanceComponent,
      resolve: {
        tipo: TipoResolver,
        tipo_json: TipoJsonResolver
      }
    },
    {
      path: 'tipo/:tipo_name/:id/edit',
      component: TipoInstanceComponent,
      resolve: {
        tipo: TipoResolver,
        tipo_json: TipoJsonResolver
      }
    }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TipoRoutingModule { }
