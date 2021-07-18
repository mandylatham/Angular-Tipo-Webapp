import { Component, OnInit, Optional, Inject, Input, ViewChild, ViewEncapsulation, Self, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS, NgControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import {ElementBase} from '../FormClasses';
import { MatFormFieldControl } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'tp-multiple-choice-view',
  templateUrl: './tpMultipleChoiceView.component.html',
  styleUrls: ['./tpMultipleChoiceView.component.scss'],
  providers: [{
    provide: MatFormFieldControl,
      useExisting: forwardRef(() => TpMultipleChoiceViewComponent)
  }],
  encapsulation: ViewEncapsulation.None
})
export class TpMultipleChoiceViewComponent extends ElementBase<string> implements OnInit {

  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public allowedvalues: any[];
  @Input() public isArray: boolean;
  @Input() public fieldValue: any;

  multipleChoiceView = [];
  imgUrl;

  @ViewChild(NgModel) model: NgModel;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    super(validators, asyncValidators, ngControl);
  }

  ngOnInit() {
    if (this.isArray) {
      this.multipleChoiceView = this.fieldValue;
    } else {
      this.multipleChoiceView.push(this.fieldValue);
    }
  }

  colourCheck (option) {
    const index = _.findIndex(this.allowedvalues, ['value', option]);
    if (index >= 0) {
        if ( this.allowedvalues[index].colour === 'NA') {
            return;
        } else {
            return this.allowedvalues[index].colour;
        }
    } else {
        return '#ddd';
    }
  }

  colourCheckClass (option) {
    const index = _.findIndex(this.allowedvalues, ['value', option]);
    if (index >= 0) {
        if (this.allowedvalues[index].colour === 'NA') {
            return 'bg-primary';
        } else {
            return;
        }
    } else {
        return;
    }
  }

  iconCheck (option) {
    const index = _.findIndex(this.allowedvalues, ['value', option]);
    if (index >= 0) {
        if (this.allowedvalues[index].icon !== 'null') {
            if (this.allowedvalues[index].icon.includes('.')) {
              this.imgUrl = true;
            } else {
              this.imgUrl = false;
            }
            return this.allowedvalues[index].icon;
        } else {
            return false;
        }
    } else {
        return false;
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
Single:
<app-tp-multiple-choice-view
[isArray]="false" fieldValue="Yes"
[allowedvalues]="[{value: 'Yes, I do',icon: 'brightness_auto',colour: '#6aa84f'},
{value: 'No, I dont',icon: 'home',colour: '#cc0000'},
{value: 'I do',icon: 'brightness_auto',colour: '#faa84f'},
{value: 'Yes',icon: 'brightness_auto',colour: '#baa84f'},
{value: 's I do',icon: 'brightness_auto',colour: 'NA'},
{value: 'Yes do',icon: 'brightness_auto',colour: '#daa84f'}]"></app-tp-multiple-choice-view>

Multiple:
<app-tp-multiple-choice-view
[isArray]="true"
[fieldValue]="['Yes', 'I do']"
[allowedvalues]="[{value: 'Yes, I do',icon: 'brightness_auto',colour: '#6aa84f'},
{value: 'No, I dont',icon: 'home',colour: '#cc0000'},
{value: 'I do',icon: 'brightness_auto',colour: '#faa84f'},
{value: 'Yes',icon: 'brightness_auto',colour: '#baa84f'},
{value: 's I do',icon: 'brightness_auto',colour: 'NA'},
{value: 'Yes do',icon: 'brightness_auto',colour: '#daa84f'}]"></app-tp-multiple-choice-view>

*/
