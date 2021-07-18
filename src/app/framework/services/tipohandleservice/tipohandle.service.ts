import { Injectable, Injector } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
// import { AuthenticationService } from '@app/auth';
import { MetadataService, AuthenticationService } from '@app/common';
import { TipoDataService } from '../tipodataservice/tipodata.service';
import { TipoManipulationService } from '../tipomanipulationservice/tipomanipulation.service';
import { TipoStateService } from '../tipostateservice/tipostate.service';
import { MatSnackBar } from '@angular/material';
import { TpConfirmationDialogComponent } from '../../dialogs/tp-confirmation-dialog/tp-confirmation-dialog.component';
import { TpDialogComponent } from '../../dialogs/tp-dialog/tp-dialog.component';
import { TpSnackBarComponent } from '../../dialogs/tp-snack-bar/tp-snack-bar.component';
import { endsWith, isArray, each, set } from 'lodash';
import { map } from 'rxjs/operators';

const userContextKey = 'security_user_context';

@Injectable({
  providedIn: 'root'
})
export class TipoHandleService {

  private _tipoDataService: TipoDataService;
  public get tipoDataService(): TipoDataService {
    if (!this._tipoDataService) {
      this._tipoDataService = this.injector.get(TipoDataService);
    }
    return this._tipoDataService;
  }

  private _tipoStateService: TipoStateService;
  public get tipoStateService(): TipoStateService {
    if (!this._tipoStateService) {
      this._tipoStateService = this.injector.get(TipoStateService);
    }
    return this._tipoStateService;
  }

  private _tipoManipulationService: TipoManipulationService;
  public get tipoManipulationService(): TipoManipulationService {
    if (!this._tipoManipulationService) {
      this._tipoManipulationService = this.injector.get(TipoManipulationService);
    }
    return this._tipoManipulationService;
  }

  private _metadataService: MetadataService;
  public get metadataService(): MetadataService {
    if (!this._metadataService) {
      this._metadataService = this.injector.get(MetadataService);
    }
    return this._metadataService;
  }

  private _authenticationService: AuthenticationService;
  public get authenticationService(): AuthenticationService {
    if (!this._authenticationService) {
      this._authenticationService = this.injector.get(AuthenticationService);
    }
    return this._authenticationService;
  }

  user_meta: any = {};
  _menu_item: any = {};

  constructor(private injector: Injector,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }



  get menu_item() {
    return this._menu_item;
  }

  getConfirmation(title, user_message) {
    const dialogRef = this.dialog.open(TpConfirmationDialogComponent, {
      width: '250px',
      data: { title: title, message: user_message }
    });

    return dialogRef.afterClosed();
  }

  showMessage(user_heading, user_message) {
    return this.snackBar.openFromComponent(TpSnackBarComponent, {
      data: { title: user_heading, message: user_message }
    });
  }

  getTipoDefinition(tipo_name) {
    return this.tipoDataService.getTipo('TipoDefinition', tipo_name, {});
  }

  callAction(tipo_name, action_name, selected_tipo_ids, additional_tipo_name, additional_tipo) {
    additional_tipo = { tipo: additional_tipo };
    this.tipoManipulationService.modifyTipoData(additional_tipo.tipo);
    if (selected_tipo_ids.length === 1) {
      return this.tipoDataService
        .performSingleAction(tipo_name, selected_tipo_ids[0], action_name, additional_tipo_name, additional_tipo.tipo);
    } else {
      return this.tipoDataService
        .performBulkAction(tipo_name, selected_tipo_ids, action_name, additional_tipo_name, additional_tipo.tipo);
    }
  }

  routeTo(url) {
    this.tipoStateService.navigateTo(url, {});
  }

  toTipo(mode, tipo_name, tipo_id) {
    if (mode === 'view') {
      this.tipoStateService.navigateTo(`/tipo/${tipo_name}/${tipo_id}`, {});
    } else if (mode === 'edit') {
      this.tipoStateService.navigateTo(`/tipo/${tipo_name}/${tipo_id}/edit`, {});
    } else if (mode === 'create') {
      this.tipoStateService.navigateTo(`/tipo/${tipo_name}/new`, {});
    } else if (mode === 'list') {
      this.tipoStateService.navigateTo(`/tipo/${tipo_name}`, {});
    }
  }

  updateUrl(tipo_name) {
    return 'g/public/gen_temp/common/views/update.tpl.html.' + (this.getUserContext().role || 'TipoUser') + '___' + tipo_name;
  }

  createUrl(tipo_name) {
    return 'g/public/gen_temp/common/views/create.tpl.html.' + (this.getUserContext().role || 'TipoUser') + '___' + tipo_name;
  }

  detailUrl(tipo_name) {
    return 'g/public/gen_temp/common/views/view.tpl.html.' + (this.getUserContext().role || 'TipoUser') + '___' + tipo_name;
  }

  listUrl(tipo_name) {
    return 'g/public/gen_temp/common/views/list.tpl.html.' + (this.getUserContext().role || 'TipoUser') + '___' + tipo_name;
  }

  jsonUrl(tipo_name) {
    return 'g/public/gen_temp/common/views/SampleJson.' + (this.getUserContext().role || 'TipoUser') + '___' + tipo_name;
  }

  saveTipo(tipo_name, tipo_id, tipo_data) {
    return this.tipoDataService.updateOne(tipo_name, tipo_id, tipo_data);
  }

  saveTipos(tipo_name, tipo_data) {
    return this.tipoDataService.updateAll(tipo_name, tipo_data);
  }

  createTipo(tipo_name, tipo_data) {
    return this.tipoDataService.upsertAll(tipo_name, [tipo_data])
                                .pipe(map(response => {
                                  return response[0].data;
                                }));
  }

  createTipos(tipo_name, tipo_data) {
    return this.tipoDataService.upsertAll(tipo_name, tipo_data);
  }

  getTipo(tipo_name, tipo_id, query_params): Observable<object> {
    return this.tipoDataService.getTipo(tipo_name, tipo_id, query_params);
  }

  getTipos(tipo_name, query_params): Observable<any[]> {
    return this.tipoDataService.getTipos(tipo_name, query_params);
  }

  getUserContext() {
    return this.authenticationService.user_meta;
  }

  setUserContext() {
    this.user_meta = this.authenticationService.user_meta;
  }

  getAppContext() {
    return this.metadataService.app_meta_data;
  }

  presentDialogForm(title, template, context, actions) {
    const dialogRef = this.dialog.open(TpDialogComponent, {
      panelClass: 'my-full-screen-dialog',
      data: { title: title, template: template, context: context, actions: actions, tipoHandle: this }
    });

    return dialogRef.afterClosed();
  }

  sendProxyHttp(method, url, headers, data, successCallback, errorCallback) {
    const tipo_data = {
      url: url,
      headers: headers,
      method: method,
      body: data && btoa(JSON.stringify(data))
    };
    this.saveTipo('TipoSpecial.TipoHttp', 'default', tipo_data);
  }

  sendPushNotification(title, text, to, tipo_name, tipo_id, perspective, mode, actions, image_url, successCallback, errorCallback) {
    const app_context = this.getAppContext();
    const user_context = this.getUserContext();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Basic $tipo_context.integration_map.pushcoms.serverApiKey'
    };
    const body = {
      app_id: '$tipo_context.integration_map.pushcoms.appId',
      headings: { en: title },
      contents: { en: text },
      filters: [],
      buttons: [],
      data: {
        tipo_name: tipo_name,
        tipo_id: tipo_id,
        perspective: perspective,
        mode: mode,
        url: ''
      },
      condition: '',
      ios_attachments: { id1: image_url },
      big_picture: image_url
    };
    body.data.url = window.location.origin + window.location.pathname;
    if (endsWith(body.data.url, '/')) {
      body.data.url = body.data.url.slice(0, -1);
    }
    if (isArray(to)) {
      each(to, function (each_topic, index) {
        body.filters.push({
          field: 'tag',
          key: app_context['TipoApp'].application_owner_account
            + '.' + app_context['TipoApp'].application
            + '.' + user_context.account + '.tipo_id',
          relation: '=',
          value: encodeURIComponent(each_topic)
        });
        if (index < to.length - 1) {
          body.filters.push({
            operator: 'OR'
          });
        }
      });
    } else if (to.includes(' ')) {
      body.condition = to;
    } else if (to.includes('@')) {
      body.filters.push({
        field: 'tag',
        key: app_context['TipoApp'].application_owner_account
          + '.' + app_context['TipoApp'].application
          + '.' + user_context.account + '.tipo_id',
        relation: '=',
        value: encodeURIComponent(to)
      });
    } else {
      body.filters.push({
        field: 'tag',
        key: app_context['TipoApp'].application_owner_account
          + '.' + app_context['TipoApp'].application + '.role',
        // key: this.user_meta.application_owner_account + "." + this.user_meta.application + ".role",
        relation: '=',
        value: to
      });
    }
    each(actions, function (action) {
      body.buttons.push({
        id: action.action_name,
        text: action.label,
        icon: action.icon
      });
      const action_item = {
        action_type: action.type,
        tipo_name: action.tipo_name,
        tipo_id: action.tipo_id,
        perspective: action.perspective,
        url: body.data.url,
        mode: action.mode
      };
      set(body.data, 'actions.' + action.action_name, action_item);
    });
    this.sendProxyHttp('POST', 'https://onesignal.com/api/v1/notifications', headers, body, successCallback, errorCallback);
  }
}
