import { Component, OnInit, forwardRef, HostBinding, Inject, Input, Optional, Self, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl, NgModel, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { ElementBase } from '../FormClasses';


export interface BooleanValue {
  value: string;
  icon: string;
  colour: string;
}

@Component({
  selector: 'tp-boolean-buttons',
  templateUrl: './tpBooleanButtons.component.html',
  styleUrls: ['./tpBooleanButtons.component.scss'],
  providers: [{
    provide: MatFormFieldControl,
      useExisting: forwardRef(() => TpBooleanButtonsComponent)
  }]
})
export class TpBooleanButtonsComponent extends ElementBase<string> implements OnInit {

  @Input() public fieldValue: any;
  @Input() public readOnly: boolean;
  @Input() public truevalues: BooleanValue;
  @Input() public falsevalues: BooleanValue;
  @Input() public defaultValue: boolean;
  @Input() public fieldname: string;

  @ViewChild(NgModel) model: NgModel;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    super(validators, asyncValidators, ngControl);
  }

  ngOnInit() {
    if (this.fieldValue || this.defaultValue) {
      this.value = this.fieldValue || this.defaultValue;
    }
  }

  onContainerClick(event: MouseEvent) {
    // if ((event.target as Element).tagName.toLowerCase() != 'input') {
    //   this.elRef.nativeElement.querySelector('input').focus();
    // }
  }
}

/*
Example:
<app-tp-boolean-buttons [readOnly]="false"
[truevalues]="{value: 'Yes, right',icon:  'home' ,colour:  'red' }"
[falsevalues]="{value: 'No, wrong',icon:  'brightness_auto' ,colour:  'NA' }"
[defaultValue]="true" [fieldValue]="true" [fieldname]="testing" >
</app-tp-boolean-buttons>
*/
