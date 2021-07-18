import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isBoolean, forEach, clone } from 'lodash';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class TipoDataService {

  constructor(private http: HttpClient) { }

  createQueryParams(query_params) {
    let params = new HttpParams();
    forEach(query_params , (value, key) => {
      if (key && (!value && !isBoolean(value))) {
          value = '__NA__';
      }
      params = params.append(key, value);
    });
    return params;
  }

  performSingleAction(tipo_name, tipo_id, action, additional_tipo_name, additional_tipo) {
    let tipo = {};
    if (additional_tipo_name) {
        tipo = {
            tipo_name: additional_tipo_name,
            data: additional_tipo
        };
    }
    const params = new HttpParams().set('tipo_action', action);
    return this.http
        .authorize()
        .put(`/api/${tipo_name}/${tipo_id}`, tipo, {params: params});
  }

  performBulkAction(tipo_name, selected_tipo_ids, action, additional_tipo_name, additional_tipo) {
    const tipos = selected_tipo_ids.map((each) => {
      return {
          tipo_name: tipo_name,
          data: {
              tipo_id: each
          }
      };
    });
    if (additional_tipo_name) {
        tipos.push({
            tipo_name: additional_tipo_name,
            data: additional_tipo
        });
    }
    const params = new HttpParams().set('tipo_action', action);
    return this.http
        .authorize()
        .put(`/api/${tipo_name}`, tipos, {params: params});
  }

  updateOne(tipo_name, id, tipo) {
    tipo = {
      tipo_name: tipo_name,
      data: clone(tipo)
    };
    if (tipo.data.tipo_id) {
        tipo.data.tipo_id = id;
    }
    return this.http
        .authorize()
        .put(`/api/${tipo_name}/${id}`, tipo);
  }

  updateAll(tipo_name, tipos) {
    tipos = tipos.map((each) => {
      return {
        tipo_name: tipo_name,
        data: each
      };
    });
    return this.http
        .authorize()
        .put(`/api/${tipo_name}`, tipos);
  }

  upsertAll(tipo_name, tipos) {
    tipos = tipos.map((each) => {
      return {
        tipo_name: tipo_name,
        data: each
      };
    });
    return this.http
        .authorize()
        .post(`/api/${tipo_name}`, tipos)
        .pipe(map(response => {
          return response['response'];
        }));
  }

  getTipo(tipo_name, tipo_id, params): Observable<object> {
    const query_params = this.createQueryParams(params);
    // const params = new HttpParams().set('type', 'application');
    return this.http
      .authorize()
      .get(`/api/${tipo_name}/${tipo_id}`, {params: query_params}).pipe(map((data) => data['data']));
  }

  getS3Signature(): Observable<object> {
    return this.http
      .authorize()
      .get(`/api/tipouploadsignature`).pipe(map((data) => data));
  }

  deleteOne(tipo_name, id) {
    return this.http
      .authorize()
      .delete(`/api/${tipo_name}/${id}`);
  }

  getTipos(tipo_name, params): Observable<any[]> {
    const query_params = this.createQueryParams(params);
    return this.http
      .authorize()
      .get(`/api/${tipo_name}`, {params: query_params}).pipe(map(data => {
        const resp = data['response'];
        const array = resp.map(response => response.data);
        return array;
      }));
  }
}
