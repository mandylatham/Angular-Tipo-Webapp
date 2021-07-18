import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TpDialogComponent } from '@app/framework/dialogs';

const routes: Routes = [
  // Fallback when no prior route is matched
  { path: 'detail/:tipo_name', component: TpDialogComponent, outlet: 'group' },
  { path: 'list/:tipo_name', component: TpDialogComponent, outlet: 'group' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
