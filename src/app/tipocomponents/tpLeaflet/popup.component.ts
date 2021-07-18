import {Component, OnInit, Input, OnChanges, SimpleChanges, NgZone} from '@angular/core';

@Component({
  selector: 'tp-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnChanges {

  @Input() data: any;
  properties: any;
  propertiesIsArray = false;

  constructor(private zone: NgZone) {
  }

  ngOnInit() {
    this.propertiesIsArray = this.data instanceof Array;
    this.properties = this.data;
  }

  ngOnChanges(changes: SimpleChanges): void {
    alert();
    const currentData = changes.data;
    this.zone.run(() => {
      if (currentData && currentData.currentValue) {
        this.propertiesIsArray = currentData.currentValue instanceof Array;
        this.properties = currentData.currentValue;
      }
    });
  }

}
