import { Renderer2, Type } from '@angular/core';
import * as Hashes from 'jshashes';

import {
  DynamicHttpResponseT,
  HASH_FIELD,
  IDynamicRemoteTemplateFactory,
  IDynamicTemplatePlaceholder,
  ILazyRoute,
} from './dynamic.interface';

const SHA1 = new Hashes.SHA1;
let uniqueId = 0;

export class Utils {

  public static nextId(): number {
    return uniqueId++;
  }

  public static buildByNextId(value: string): string {
    return value.replace('{id}', String(this.nextId()));
  }

  public static isPresent(obj) {
    return obj !== undefined && obj !== null;
  }

  public static isFunction(obj) {
    return typeof obj === 'function';
  }

  public static findLazyRouteLoader(path: string, routes: ILazyRoute[]): ILazyRoute {
    return routes.filter((lazyRouter: ILazyRoute) => lazyRouter.path === path)[0];
  }

  public static applySourceAttributes(target: {}, source: {}) {
    if (!Utils.isPresent(source)) {
      return;
    }
    for (const property in source) {
      if (source.hasOwnProperty(property)) {
        const propValue = Reflect.get(source, property);
        const proxyObject: PropertyDescriptor = {};

        if (!Utils.isFunction(propValue)) {
          proxyObject.set = (v) => Reflect.set(source, property, v);
        }
        proxyObject.get = () => Reflect.get(source, property);

        Reflect.defineProperty(target, property, proxyObject);
      }
    }
  }

  public static toTemplate(remoteTemplateFactory: IDynamicRemoteTemplateFactory, response: DynamicHttpResponseT): string {
    const template = this.isPresent(remoteTemplateFactory) && this.isFunction(remoteTemplateFactory.parseResponse)
      ? remoteTemplateFactory.parseResponse(response)
      : null;

    if (!this.isPresent(template)) {
      try {
        return JSON.stringify(response.body);
      } catch (e) {
        return response.statusText;
      }
    } else {
      return template;
    }
  }

  public static replaceDynamicContent(renderer: Renderer2, dynamicWrapperEl: Element): Element[] {
    if (!dynamicWrapperEl.children.length) {
      return null;
    }
    const els = [];
    for (const dEl of Array.from(dynamicWrapperEl.children)) {
      renderer.insertBefore(dynamicWrapperEl.parentElement, dEl, dynamicWrapperEl);
      els.push(dEl);
    }
    renderer.removeChild(dynamicWrapperEl.parentElement, dynamicWrapperEl);
    return els;
  }

  public static toHash(v: string): string {
    return SHA1.hex(v);
  }

  public static applyHashField(target: {}, source: Type<IDynamicTemplatePlaceholder> | string): void {
    if (Utils.isPresent(source)) {
      Reflect.set(
        target,
        HASH_FIELD,
        typeof source === 'string' ? Utils.toHash(source) : Reflect.get(source, HASH_FIELD)
      );
    }
  }
}
