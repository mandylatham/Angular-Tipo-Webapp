import { NgModule, ModuleWithProviders, SystemJsNgModuleLoader, NgModuleFactoryLoader } from '@angular/core';

import { DynamicDirective } from './dynamic.directive';
import { DynamicCache } from './dynamic.cache';
import { DynamicTypes, IDynamicTemplateOptions, ROUTES_TOKEN, REMOVE_DYNAMIC_WRAPPER } from './dynamic.interface';
import { DynamicTemplateModuleHolder } from './dynamic.holder';

@NgModule(
  {
    declarations: [
      DynamicDirective
    ],
    exports: [
      DynamicDirective
    ],
  }
)
export class NgxDynamicTemplateModule {

  public static forRoot(options?: IDynamicTemplateOptions): ModuleWithProviders {
    if (DynamicTemplateModuleHolder.saveAndGet()) {
      throw new Error('You cannot create dynamic template module more one time!');
    }
    return DynamicTemplateModuleHolder.saveAndGet({
      ngModule: NgxDynamicTemplateModule,
      providers: [
        DynamicCache,
        {
          provide: DynamicTypes.DynamicExtraModules,
          useValue: options && options.extraModules ? options.extraModules : [],
        },
        { provide: DynamicTypes.DynamicResponseRedirectStatuses, useValue: [301, 302, 307, 308] },
        { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
        { provide: ROUTES_TOKEN, useValue: options && options.routes || [] },
        { provide: REMOVE_DYNAMIC_WRAPPER, useValue: options && options.removeDynamicWrapper || false },
      ],
    });
  }
}
