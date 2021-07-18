import { Component, OnInit } from '@angular/core';
import { TipoComponentsModule } from '@app/tipocomponents';

import { Logger } from '@app/common';

const log = new Logger('DashboardComponent');

@Component({
  selector: 'app-dashboard',
  template: `<tp-simple-dropdown> </tp-simple-dropdown>`
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    log.debug('Init Dashboard');
  }

}
