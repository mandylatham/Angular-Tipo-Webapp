import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';


const SUBSCRIPTION_RESOURCE = 'tipo_app_info';
const ACCOUNT_RESOURCE = 'TipoAccount/default';
const PROFILE_RESOURCE = 'TipoUser/default';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  app_meta_data: object = null;
  constructor(private http: HttpClient) { }

  loadAppMetadata(): Promise<object> {
    const params = new HttpParams().set('type', 'application');
    return this.http.get('/api/' + SUBSCRIPTION_RESOURCE, { params: params })
    .pipe(tap(meta_data => {
      this.app_meta_data = meta_data;
    }))
    .toPromise();
  }
}
