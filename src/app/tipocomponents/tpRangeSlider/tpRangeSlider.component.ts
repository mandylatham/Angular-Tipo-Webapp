// tslint:disable-next-line:max-line-length
import { Component, OnInit, AfterViewInit, forwardRef, ElementRef, Inject, Input, Optional, Self, ViewChild } from '@angular/core';
import { NgControl, NgModel, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ElementBase } from '../FormClasses';
import { MatFormFieldControl } from '@angular/material';
import { NouiFormatter } from 'ng2-nouislider';

import * as wNumb from '../../../../node_modules/wnumb/wNumb.js';

@Component({
  selector: 'tp-range-slider',
  templateUrl: './tpRangeSlider.component.html',
  styleUrls: ['./tpRangeSlider.component.scss'],
  providers: [{
    provide: MatFormFieldControl,
    useExisting: forwardRef(() => TpRangeSliderComponent)
  },
]
})

export class TpRangeSliderComponent extends ElementBase<Array<string>> implements OnInit, AfterViewInit {

  @ViewChild('slider', {read: ElementRef}) slider: ElementRef;
  @ViewChild(NgModel) model: NgModel;

  @Input() min: any;
  @Input() max: any;
  @Input() step: any;
  @Input() start: any;
  @Input() stop: any;

  sliderRange;
  config;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    super(validators, asyncValidators, ngControl);
  }

  ngOnInit(): void {
    const start = this.value || [this.min, this.max];
    this.config = {
    connect: true,
    start: start,
    step: 1,
    tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
    range: {
      min: this.min,
      max: this.max
    },
    behaviour: 'drag',
    // cssPrefix: '',
    // cssClasses: {
    //   target: 'noUi-target',
    //   base: 'noUi-base',
    //   origin: 'noUi-origin',
    //   handle: 'noUi-handle',
    //   handleLower: 'noUi-handle-lower',
    //   handleUpper: 'noUi-handle-upper',
    //   horizontal: 'noUi-horizontal',
    //   vertical: 'noUi-vertical',
    //   background: 'noUi-background',
    //   connect: 'noUi-connect',
    //   ltr: 'noUi-ltr',
    //   rtl: 'noUi-rtl',
    //   draggable: 'noUi-draggable',
    //   drag: 'noUi-state-drag',
    //   tap: 'noUi-state-tap',
    //   active: 'noUi-active',
    //   stacking: 'noUi-stacking',
    //   tooltip: 'noUi-tooltip',
    //   pips: 'noUi-pips',
    //   pipsHorizontal: 'noUi-pips-horizontal',
    //   pipsVertical: 'noUi-pips-vertical',
    //   marker: 'noUi-marker',
    //   markerHorizontal: 'noUi-marker-horizontal',
    //   markerVertical: 'noUi-marker-vertical',
    //   markerNormal: 'noUi-marker-normal',
    //   markerLarge: 'noUi-marker-large',
    //   markerSub: 'noUi-marker-sub',
    //   value: 'noUi-value'
    // }
    };
  }

  ngAfterViewInit() {
    this.setPrimaryColor();
  }

  setPrimaryColor() {
    const connect = this.slider.nativeElement.querySelectorAll('.noUi-connect');
      for (let i = 0; i < connect.length; i++) {
        connect[i].classList.add('bg-primary');
    }
    const tooltip = this.slider.nativeElement.querySelectorAll('.noUi-tooltip');
      for (let i = 0; i < tooltip.length; i++) {
        tooltip[i].classList.add('bg-primary');
    }
    const handle = this.slider.nativeElement.querySelectorAll('.noUi-handle');
      for (let i = 0; i < handle.length; i++) {
        handle[i].classList.add('bg-primary');
    }
  }


  onContainerClick(event: MouseEvent) {
    // if ((event.target as Element).tagName.toLowerCase() != 'input') {
    //   this.elRef.nativeElement.querySelector('input').focus();
    // }
  }

}
