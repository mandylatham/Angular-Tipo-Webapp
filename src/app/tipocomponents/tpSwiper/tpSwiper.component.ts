import { Component, OnInit, Optional, Inject, Input, ViewChild, AfterViewInit, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { MetadataService } from '@app/common';

import { SwiperComponent, SwiperConfigInterface,
  SwiperScrollbarInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { ElementBase } from '../FormClasses';

import * as _ from 'lodash';

@Component({
  selector: 'tp-swiper',
  templateUrl: './tpSwiper.component.html',
  styleUrls: ['./tpswiper.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TpSwiperComponent,
    multi: true,
  }]
})

export class TpSwiperComponent extends ElementBase<string> implements AfterViewInit {
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public allowedvalues: any[];

  @ViewChild(NgModel) model: NgModel;

  @Input() direction: string;
  @Input() effect: string;
  @Input() paginationType: any;
  @Input() paginationHide: boolean;
  @Input() mouseWheelControl: boolean;
  @Input() loop: boolean;
  @Input() imageArray: any;
  @Input() fromType: string;

  mystyles: any;
  swiperColor: any;
  prevButton;
  nextButton;

  private scrollbar: SwiperScrollbarInterface = {
    el: '.swiper-scrollbar',
    hide: false,
    draggable: true
  };

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true,
    hideOnClick: this.paginationHide || false,
    type: this.paginationType || 'bullets',
    bulletActiveClass: 'bg-primary'
  };

  public config: SwiperConfigInterface = {
    a11y: true,
    slidesPerView: 1,
    spaceBetween: 30,
    direction: this.direction || 'horizontal',
    mousewheel: this.mouseWheelControl || false,
    effect: this.effect || 'slide',
    loop: this.loop || false,
    keyboard: true,
    scrollbar: false,
    pagination: this.pagination,
    navigation: true,
  };

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    private metaDataService: MetadataService
  ) {
    super(validators, asyncValidators, null);
  }


  ngAfterViewInit() {
    // this.swiperColor = this.metaDataService.app_meta_data.TipoCustomization.appearance_settings.theme_colour_primary;
    }

  public onIndexChange(index: number): void {
    console.log('Swiper index: ', index);
  }

  public onSwiperEvent(event: string): void {
    console.log('Swiper event: ', event);
  }

  onContainerClick() {
  }


}
