import 'hammerjs';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// adding the scripts required for the froala editor
import * as $ from 'jquery'; window['$'] = $; window['jQuery'] = $;
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'fine-uploader/s3.fine-uploader/s3.fine-uploader.js';

