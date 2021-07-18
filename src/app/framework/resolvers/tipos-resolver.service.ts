import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { TipoHandleService, TipoManipulationService } from '@app/framework/services';

import { Logger } from '@app/common';

const log = new Logger('TiposResolver');


@Injectable({
  providedIn: 'root'
})
export class TiposResolver implements Resolve<any> {

  constructor(private http: HttpClient, private tipo_handle: TipoHandleService, private tipo_manipulation: TipoManipulationService) { }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    const tipo_name = route.params.tipo_name;
    log.debug('resolving tipo', tipo_name);

    return this.tipo_handle.getTipos(tipo_name, {});

  }
}
