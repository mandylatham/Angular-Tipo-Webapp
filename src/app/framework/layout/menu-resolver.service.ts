
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Logger } from '@app/common';
import { TipoHandleService, TipoManipulationService } from '@app/framework/services';
import { Observable } from 'rxjs';



const log = new Logger('MenuResolver');


@Injectable({
  providedIn: 'root'
})
export class MenuResolver implements Resolve<any> {

  constructor(private http: HttpClient, private tipo_handle: TipoHandleService, private tipo_manipulation: TipoManipulationService) { }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    console.log('Resolving Menu', route, rstate);
    let perspective;
    if (!route.queryParams.perspective) {
      perspective = 'Home';
    } else {
      perspective = route.queryParams.perspective;
    }

    return this.tipo_handle.getTipo('TipoDefinition', perspective, {});
  }
}
