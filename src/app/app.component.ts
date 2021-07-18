import { Component, OnInit } from '@angular/core';
import { Logger } from '@app/common';
import { MetadataService } from '@app/common';


const log = new Logger('AppComponent');

@Component({
  selector: 'tp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tipo-ui-pilot';

  constructor(private metaDataService: MetadataService) { }

  ngOnInit() {
    console.log(`TipoApp Info ${this.metaDataService.app_meta_data}`);
  }
}
