

import { Component, OnInit, Optional, Self, Inject, Input, forwardRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  NgModel,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
  NgControl
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { ElementBase } from '../FormClasses';

@Component({
  selector: 'tp-text-mask',
  templateUrl: './tpTextMask.component.html',
  styleUrls: ['./tpTextMask.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => TpTextMaskComponent)
    }]
})
export class TpTextMaskComponent extends ElementBase<string>  implements OnInit {
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public allowedvalues: any[];

  @ViewChild(NgModel) model: NgModel;

  @Input() public name = '';
  @Input() public fieldValue: any = '';
  @Input() public textPattern: any = '';
  @Input() public fieldType: any = '';
  @Input() public forceValidation: any = '';
  @Input() public patternValidation: any = '';
  @Input() public placeholderChar: any = '';
  @Input() public isRequired: any = '';
  @Input() public fieldLabel: any = '';
  @Input() public guide: any = true;
  public myModel = '';
  public pattern: any = {};
  public context: any = '';
  public regexValidation: any;
  public placeHolderString: any = '';



  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    super(validators, asyncValidators, ngControl);
  }

  ngOnInit(): void {
    this.pattern.mask = [];
    this.pattern.pipe = this.convertToRaw;
    this.pattern.guide = this.guide;
    this.pattern.placeholderChar = this.placeholderChar;

    if (!this.placeholderChar) {
      this.pattern.placeholder = '\u2000';
    }

    this.fieldLabel = this.fieldLabel || '';
    this.fieldValue = this.fieldValue || '';
    this.regexValidation = '';
    for (let i = 0; i < this.textPattern.length; i++) {
      if (this.textPattern[i] !== '#') {
        this.placeHolderString = this.placeHolderString + ' ';
        if (isNaN(parseInt(this.textPattern[i] , 10)) && !this.textPattern[i].match(/[A-za-z]/i)) {
          this.regexValidation = this.regexValidation + '\\' + this.textPattern[i];
        } else {
          this.regexValidation = this.regexValidation + '[' + this.textPattern[i] + ']';
        }
        this.pattern.mask.push(this.textPattern[i]);
      } else {
        this.placeHolderString = this.placeHolderString + this.placeholderChar;
        if (this.fieldType === 'integer') {
          this.regexValidation = this.regexValidation + '\\d';
          this.pattern.mask.push(/\d/);
        } else {
          this.regexValidation = this.regexValidation + '[A-za-z0-9]';
          this.pattern.mask.push(/\w/);
        }
      }
    }

    if (!this.forceValidation) {
      this.regexValidation = this.patternValidation || '';
    } else {
      this.regexValidation = new RegExp(this.regexValidation);
    }
  }
  convertToRaw = (conformedValue, config) => {
    this.fieldValue = '';
    for (let i = 0; i < config.currentCaretPosition; i++) {
      if (config.placeholder[i] === '_' || config.placeholderChar) {
        if (conformedValue[i]) {
          this.fieldValue = this.fieldValue + conformedValue[i];
        }
      }
    }
    return conformedValue;
  }

  onContainerClick(event: MouseEvent) {
    // if ((event.target as Element).tagName.toLowerCase() != 'input') {
    //   this.elRef.nativeElement.querySelector('input').focus();
    // }
  }
}

