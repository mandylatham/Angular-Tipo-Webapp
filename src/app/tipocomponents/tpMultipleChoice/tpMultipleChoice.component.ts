import { Component, OnInit, forwardRef, HostBinding, Inject, Input, Optional, Self, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgControl, NgModel, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { ElementBase } from '../FormClasses';

@Component({
  selector: 'tp-multiple-choice',
  templateUrl: './tpMultipleChoice.component.html',
  styleUrls: ['./tpMultipleChoice.component.scss'],
  providers: [{
    provide: MatFormFieldControl,
      useExisting: forwardRef(() => TpMultipleChoiceComponent)
  }]
})
export class TpMultipleChoiceComponent extends ElementBase<Array<string>> implements OnInit {

  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public allowedvalues: any[];
  @Input() public isArray: boolean;
  @Input() public fieldValue: any;
  @Input() public readOnly: boolean;

  multipleChoice: any;

  @ViewChild(NgModel) model: NgModel;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    super(validators, asyncValidators, ngControl);
  }

  ngOnInit() {
    if (this.fieldValue) {
      this.value = this.fieldValue;
    }
    if (this.isArray && !this.fieldValue) {
      this.value = [];
    }
  }

  toggle (item) {
    if (this.value && this.value.length >= 0) {
      const idx = this.value.indexOf(item);
      if (idx > -1) {
        this.value.splice(idx, 1);
      } else {
        this.value.push(item);
      }
    }
  }

  exists(item) {
    if (this.value && this.value.length >= 0) {
      if (this.value.indexOf(item) > -1) {
        if (this.readOnly) {
          setTimeout(() => {
            const ele = document.getElementById(item);
            const child = ele.children[0].children;
          for (let i = 0 ; i < child.length; i++ ) {
            if (child[i].tagName === 'SPAN') {
              child[i].setAttribute('style', 'color:white;');
            }
          }
          }, 100);
        }
        return true;
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
<app-tp-multiple-choice [isArray]="false"
[readOnly]="false" fieldValue="Yes"
[allowedvalues]="[{value: 'Yes, I do',icon: 'brightness_auto',colour: '#6aa84f'},
{value: 'No, I dont',icon: 'home',colour: '#cc0000'},
{value: 'I do',icon: 'brightness_auto',colour: '#faa84f'},
{value: 'Yes',icon: 'brightness_auto',colour: '#baa84f'},
{value: 's I do',icon: 'brightness_auto',colour: 'NA'},
{value: 'Yes do',icon: 'brightness_auto',colour: '#daa84f'}]">
</app-tp-multiple-choice>

Multiple:
<app-tp-multiple-choice
[isArray]="true"
[readOnly]="false"
[fieldValue]="['Yes', 'I do']"
[allowedvalues]="[{value: 'Yes, I do',icon: 'brightness_auto',colour: '#6aa84f'},
{value: 'No, I dont',icon: 'home',colour: '#cc0000'},
{value: 'I do',icon: 'brightness_auto',colour: '#faa84f'},
{value: 'Yes',icon: 'brightness_auto',colour: '#baa84f'},
{value: 's I do',icon: 'brightness_auto',colour: 'NA'},
{value: 'Yes do',icon: 'brightness_auto',colour: '#daa84f'}]"></app-tp-multiple-choice>

*/
