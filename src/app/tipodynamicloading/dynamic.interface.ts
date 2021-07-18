import { Type, InjectionToken } from '@angular/core';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

export const DynamicTypes = {
  DynamicExtraModules: 'DynamicExtraModules',
  DynamicResponseRedirectStatuses: 'DynamicResponseRedirectStatuses',
};

export interface IDynamicRemoteTemplateFactory {
  context?: any;
  buildRequestOptions?(): IDynamicHttpRequest;
  parseResponse?(response: DynamicHttpResponseT): string;
}

export type DynamicHttpResponseT = HttpResponse<{ [key: string]: any }>;

export interface IDynamicHttpRequest {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  observe?: any;
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  responseType?: any;
  withCredentials?: boolean;
}

export interface IDynamicTemplateContext {
  [index: string]: any;
}

export interface IDynamicTemplatePlaceholder {
}

export interface IDynamicTemplateMetadata {
  selector: string;
  styles?: string[];
  template?: string;
  templateUrl?: string;
}

export type AnyT = Type<any>;

export interface IDynamicTemplateOptions {
  extraModules?: any[];
  routes?: ILazyRoute[];
  removeDynamicWrapper?: boolean;
}

export interface ILazyRoute {
  path?: string;
  component?: any;
  loadChildren?: Function | string;
}

export interface IDynamicComponentConfig {
  template?: string;
  templatePath?: string;
}

export const HASH_FIELD = '$$hashValue';
export const ROUTES_TOKEN = new InjectionToken('ROUTES');
export const REMOVE_DYNAMIC_WRAPPER = new InjectionToken('REMOVE_DYNAMIC_WRAPPER');
