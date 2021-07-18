import { ModuleWithProviders } from '@angular/core';

let moduleInstance: ModuleWithProviders;

export class DynamicTemplateModuleHolder {

  public static saveAndGet(module?: ModuleWithProviders): ModuleWithProviders {
    return moduleInstance || (moduleInstance = module);
  }
}
