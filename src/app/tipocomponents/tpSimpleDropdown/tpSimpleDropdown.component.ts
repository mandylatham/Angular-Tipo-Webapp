import { Component, forwardRef, HostBinding, Inject, Input, Optional, Self, ViewChild } from '@angular/core';
import { NgControl, NgModel, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { ElementBase } from '../FormClasses';

@Component({
  selector: 'tp-simple-dropdown',
  templateUrl: './tpSimpleDropdown.component.html',
  styleUrls: ['./tpSimpleDropdown.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => TpSimpleDropdownComponent)
    }]
})
export class TpSimpleDropdownComponent extends ElementBase<string>  {
  static nextId = 0;

  @HostBinding() id = `tp-simple-dropdown-${TpSimpleDropdownComponent.nextId++}`;

  @Input() public label: string;
  @Input() public isArray: boolean;
  @Input() public readOnly: boolean;
  @Input() public allowedvalues: any[];
  controlType = 'tp-simple-dropdown';
  @ViewChild(NgModel) model: NgModel;



  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    super(validators, asyncValidators, ngControl);
  }
  onContainerClick(event: MouseEvent) {
    // if ((event.target as Element).tagName.toLowerCase() != 'input') {
    //   this.elRef.nativeElement.querySelector('input').focus();
    // }
  }
}
