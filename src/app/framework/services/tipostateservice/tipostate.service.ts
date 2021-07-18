import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, share, pairwise, publishBehavior, refCount, startWith } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, UrlTree, NavigationEnd } from '@angular/router';
import { snakeCase, isEmpty, isUndefined } from 'lodash';

export interface PerspectiveMetaData {
  perspective: string;
  tipo_name: string;
  display_name: string;
  singleton?: boolean;
  field_name?: string;
  tipo_id?: string;
  tipo_filter?: string;
  abstract?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TipoStateService {
  _userContext: object;
  _appContext: object;
  _current_url_tree: any;
  _perspectiveMetaData: PerspectiveMetaData;
  perspectiveChanges: Observable<[string, string]>;
  perspective: string;
  fromperspective: string;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location) {

    this.perspectiveChanges = this.router.events.pipe(filter(event => event instanceof NavigationEnd),
      map(navigation => {
        return this.getPerspectiveFromUrl(navigation);
      }),
      publishBehavior('/dashboard?perspective=Home'),
      refCount(),
      startWith(undefined),
      pairwise(),
      filter(perspectives => (perspectives[1] !== perspectives[0] || !perspectives[0]))
    );

  }

  get perspectiveMetaData(): PerspectiveMetaData | null {
    return this._perspectiveMetaData;
  }

  setperspectiveMetaData(tipoDefinition) {
    const perspective = this.getCurrentPerspective();
    const parts = perspective.split('.');
    const tipo_name = parts[0];
    this._perspectiveMetaData = {
      perspective: perspective,
      tipo_name: tipo_name,
      display_name: tipoDefinition.tipo_meta.display_name
    };

    if (parts.length > 1) {
      const tipo_id = parts[1];
      if (tipo_id === 'default') {
        this._perspectiveMetaData.singleton = true;
      } else {
        const field_name = tipoDefinition.tipo_meta.perspective_field_name || snakeCase(tipo_name);
        this._perspectiveMetaData = {
          field_name: field_name,
          tipo_id: tipo_id,
          tipo_filter: `(${field_name}:(${tipo_id}))`,
          ...this._perspectiveMetaData
        };
      }
    } else {
      this._perspectiveMetaData.abstract = true;
    }
  }

  toTipoResponse(resData, tipo_name, tipo_id, parameters) {
    let return_url;
    if (!isEmpty(resData.return_url) || !isUndefined(resData.return_url)) {
        if (!(resData.return_url).includes('?')) {
            return_url = resData.return_url + '?';
        } else {
            return_url = resData.return_url + '&';
        }
        if (!isEmpty(resData.message) || !isUndefined(resData.message)) {
            return_url = return_url + 'message=' + resData.message + '&';
        }
        if (!isEmpty(resData.tab_url) || !isUndefined(resData.tab_url)) {
            if (resData.tab_url.includes('#')) {
                resData.tab_url = resData.tab_url.replace(/\#/, '%23');
            }
            return_url = return_url + 'tab_url=' + resData.tab_url;
        }
        this.router.navigateByUrl(this.router.createUrlTree(return_url));
    } else {
        if (!isEmpty(resData.tab_url) || !isUndefined(resData.tab_url)) {
            // openTabPopup(resData.tab_url, tipo_name, resData.message);
        } else {
            if (!parameters) {
                parameters = {};
            }
            parameters.message = resData.message;
            if (!isEmpty(tipo_name) || !isUndefined(tipo_name)) {
              this.navigateTo(`/tipo/${tipo_name}/${tipo_id}`, parameters);
            }
            if (!isEmpty(resData.message) || !isUndefined(resData.message)) {
                // openMessageToast(resData.message);
            }
        }
    }
}

  getPerspectiveFromUrl(navigation) {
    const urlTree = this.router.parseUrl(navigation['url']);
    this._current_url_tree = urlTree;
    const perspective = urlTree.queryParams.perspective;
    return perspective;
  }

  resolvePerspective(parameters) {
    if (!parameters.perspective) {
      parameters.perspective = this.getCurrentPerspective();
    }
  }

  getCurrentUrlTree() {
    return this.router.parseUrl(this.router.url);
  }
  getCurrentPerspective() {
    return this.activatedRoute.queryParams['_value'].perspective || 'Home';
  }

  navigateTo(path, params) {
    this.resolvePerspective(params);
    this.router.navigate([path], { replaceUrl: true, queryParams: params });
  }


  toMenuItem(menuItem) {
    if (menuItem.state) {
      return this.navigateTo(menuItem.state, {});
    } else if (menuItem.tipo_name) {

      let parameters: any = {};
      if (menuItem.perspective) {
        parameters = {
          perspective: menuItem.perspective
        };
      } else {
        this.resolvePerspective(parameters);
      }
      if (menuItem.abstract) {
        this.navigateTo('/dashboard', { perspective: menuItem.id });
      } else {
        if (menuItem.isSingleton) {
          return this.navigateTo(`/tipo/${menuItem.tipo_name}/default`, parameters);
        } else {
          if (menuItem.quickFilters) {
            parameters.filter = menuItem.quickFilters;
          }
          return this.navigateTo(`/tipo/${menuItem.tipo_name}`, parameters);
        }
      }
    } else if (menuItem.navigate_to) {
      // openTabPopup(menuItem.navigate_to, "", "You are navigating to: " + menuItem.navigate_to);
    } else if (menuItem.location_to) {
      this.navigateTo(menuItem.location_to, {});
    }
  }

}
