import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Logger } from '@app/common';
import { TipoHandleService, TipoManipulationService } from '@app/framework/services';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';



const log = new Logger('TipoResolver');


@Injectable({
  providedIn: 'root'
})
export class TipoResolver implements Resolve<any> {

  constructor(private http: HttpClient, private tipo_handle: TipoHandleService, private tipo_manipulation: TipoManipulationService) { }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    const tipo_name = route.params.tipo_name;
    const tipo_id = route.params.tipo_id;
    log.debug('resolving tipo', tipo_name);

    return this.tipo_handle.getTipo(tipo_name, tipo_id, {});

  }
}

@Injectable({
  providedIn: 'root'
})
export class TipoJsonResolver implements Resolve<any> {

  constructor(private http: HttpClient, private tipo_handle: TipoHandleService, private tipo_manipulation: TipoManipulationService) { }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
    const tipo_name = route.params.tipo_name;
    return this.http.get(this.tipo_handle.jsonUrl(tipo_name))
              .pipe(map((jsonResponse) => {
                log.debug('Json Response', jsonResponse);
                return {json: jsonResponse, form: this.tipo_manipulation.jsonToFormGroup({tipo: jsonResponse})};
              }));

  }
}
