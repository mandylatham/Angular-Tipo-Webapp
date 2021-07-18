import {
  Directive,
  Inject,
  ViewContainerRef,
  NgModuleFactoryLoader,
  Compiler,
  Optional,
  Renderer2,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DynamicBase } from './dynamic.base';
import { DynamicCache } from './dynamic.cache';
import { DynamicTypes, ROUTES_TOKEN, ILazyRoute, REMOVE_DYNAMIC_WRAPPER } from './dynamic.interface';

@Directive({
  selector: '[dynamic-template]',
})
export class DynamicDirective extends DynamicBase {

  constructor(@Inject(DynamicTypes.DynamicExtraModules) dynamicExtraModules: any[],
              @Inject(DynamicTypes.DynamicResponseRedirectStatuses) dynamicResponseRedirectStatuses: number[],
              @Inject(ViewContainerRef) viewContainer: ViewContainerRef,
              @Inject(Compiler) compiler: Compiler,
              @Optional() @Inject(HttpClient) http: HttpClient,
              @Inject(Renderer2) renderer: Renderer2,
              @Inject(NgModuleFactoryLoader) moduleFactoryLoader: NgModuleFactoryLoader,
              @Inject(DynamicCache) dynamicCache: DynamicCache,
              @Inject(ROUTES_TOKEN) routes: ILazyRoute[],
              @Inject(REMOVE_DYNAMIC_WRAPPER) removeDynamicWrapper: boolean) {
    super(
      dynamicExtraModules,
      dynamicResponseRedirectStatuses,
      viewContainer,
      compiler,
      http,
      renderer,
      dynamicCache,
      moduleFactoryLoader,
      routes,
      removeDynamicWrapper,
      '[dynamic-template-{id}]'
    );
  }
}
