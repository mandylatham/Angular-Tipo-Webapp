import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@app/material.module';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {TextMaskModule} from 'angular2-text-mask';
import {MccColorPickerModule} from 'material-community-components';
import {TpFileModule} from './tpFile/tpFile.module';
import {SwiperModule, SWIPER_CONFIG, SwiperConfigInterface} from 'ngx-swiper-wrapper';
import {NouisliderModule} from 'ng2-nouislider';
import {InternationalPhoneModule} from 'ng4-intl-phone';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LeafletDrawModule} from '@asymmetrik/ngx-leaflet-draw';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';
// directives
import {TpIntlTelInputDirective} from './tpIntlTelInput/tpIntlTelInput.directive';
import {TpLoaderComponent} from './tpLoader/tpLoader.component';
import {TpLookupComponent} from './tpLookup/tpLookup.component';
import {TpRangeSliderComponent} from './tpRangeSlider/tpRangeSlider.component';
import {TpSimpleDropdownComponent} from './tpSimpleDropdown/tpSimpleDropdown.component';
import {TpSwiperComponent} from './tpSwiper/tpSwiper.component';
import {TpTextMaskComponent} from './tpTextMask/tpTextMask.component';
import {TpMultipleChoiceComponent} from './tpMultipleChoice/tpMultipleChoice.component';
import {TpMultipleChoiceViewComponent} from './tpMultipleChoiceView/tpMultipleChoiceView.component';
import {TpDatePickerComponent} from './tpDatePicker/tpDatePicker.component';
import {TpBooleanButtonsComponent} from './tpBooleanButtons/tpBooleanButtons.component';
import {TpFroalaComponent} from './tpFroala/tpFroala.component';
import {TpLeafletComponent} from './tpLeaflet/tpLeaflet.component';
import {PopupComponent} from './tpLeaflet/popup.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  observer: true,
  direction: 'horizontal',
  threshold: 50,
  spaceBetween: 5,
  slidesPerView: 1,
  centeredSlides: true
};

@NgModule({
  declarations: [
    TpSwiperComponent,
    TpTextMaskComponent,
    TpIntlTelInputDirective,
    TpRangeSliderComponent,
    TpLoaderComponent,
    TpSimpleDropdownComponent,
    TpLookupComponent,
    TpMultipleChoiceComponent,
    TpMultipleChoiceViewComponent,
    TpDatePickerComponent,
    TpBooleanButtonsComponent,
    TpFroalaComponent,
    TpLeafletComponent,
    PopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    SwiperModule,
    NouisliderModule,
    TextMaskModule,
    InternationalPhoneModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    MccColorPickerModule.forRoot({
      empty_color: 'transparent'
    }),
    TpFileModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    LeafletMarkerClusterModule.forRoot()
  ],
  entryComponents: [PopupComponent],
  exports: [
    TpSwiperComponent,
    TpTextMaskComponent,
    TpIntlTelInputDirective,
    TpRangeSliderComponent,
    TpLoaderComponent,
    TpSimpleDropdownComponent,
    TpLookupComponent,
    TpMultipleChoiceComponent,
    TpMultipleChoiceViewComponent,
    TpDatePickerComponent,
    TpBooleanButtonsComponent,
    TpFileModule,
    TpFroalaComponent,
    TpLeafletComponent
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class TipoComponentsModule {
}
