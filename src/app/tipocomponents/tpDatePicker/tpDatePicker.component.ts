import { Component, OnInit, forwardRef, HostBinding, Inject, Input, Optional, Self, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl, NgModel, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { ElementBase } from '../FormClasses';
import flatpickr from 'flatpickr';
import * as moment from 'moment';

@Component({
  selector: 'tp-date-picker',
  templateUrl: './tpDatePicker.component.html',
  styleUrls: ['./tpDatePicker.component.scss'],
  providers: [{
    provide: MatFormFieldControl,
      useExisting: forwardRef(() => TpDatePickerComponent)
  }],
  encapsulation: ViewEncapsulation.None
})
export class TpDatePickerComponent extends ElementBase<string> implements OnInit {

  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public options: any;
  @Input() public fieldValue: any;
  @Input() public datenumber: number;

  @ViewChild(NgModel) model: NgModel;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    super(validators, asyncValidators, ngControl);
  }

  ngOnInit() {
    this.options.onChange = function(selectedDates, dateStr, instance) {
      const time = moment.utc(dateStr).format('HH.mm.sss');
      const timearray = time.split('.');
      this.datenumber = (+timearray[0] * 3600) + (+timearray[1] * 60) + (+timearray[2]);
    };
    flatpickr('#datePicker', this.options);
  }

  onContainerClick(event: MouseEvent) {
    // if ((event.target as Element).tagName.toLowerCase() != 'input') {
    //   this.elRef.nativeElement.querySelector('input').focus();
    // }
  }
}

/*
Example:

<app-tp-date-picker color="primary"
[options]="{enableTime: true,dateFormat: 'Z',altInput: true,minDate: 'today',maxDate: 'January 16, 2019', mode: 'range'}">
</app-tp-date-picker>
*/
