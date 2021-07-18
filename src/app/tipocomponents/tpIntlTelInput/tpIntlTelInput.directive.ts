import { OnInit, Input, Directive, ElementRef, forwardRef, Renderer2, HostListener} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator, ControlValueAccessor } from '@angular/forms';
import intlTelInput from 'intl-tel-input/build/js/intlTelInput';

@Directive({
  selector: '[tpIntlTelInput]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TpIntlTelInputDirective),
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TpIntlTelInputDirective),
      multi: true
    }
  ]
})
export class TpIntlTelInputDirective implements OnInit, Validator, ControlValueAccessor {
  @Input()
  public label: string;
  public iti: any;

  constructor(public element: ElementRef, private renderer: Renderer2) {
    const _this = this;
    this.element.nativeElement.addEventListener('countrychange', function () {
    });
  }

  @HostListener('input', [ '$event.target.value' ])
  input( value ) {
    this.onChange(value);
  }

  validate(c: AbstractControl): { [key: string]: any } {
    console.log('calling', c);
    if (this.iti.isValidNumber()) {
      return null;
    }
    return {
      validation: false
    };
  }

  writeValue( value: any ): void {
    if (value) {
      // this.iti('setNumber', value);
      const countryCode = this.iti.selectedCountryData;
      if (value.contains('+' + countryCode.dialCode)) {
          value.replace('+' + countryCode.dialCode, '');
      }
      // this.iti('setNumber', value);
  }
    const element = this.element.nativeElement;
    this.renderer.setProperty(element, 'value', value);
  }

  registerOnChange( fn: any ): void {
    this.onChange = fn;
  }

  registerOnTouched( fn: any ): void {
    this.onChange = fn;
  }

  onChange(value) {
    // this.iti('setNumber', intlTelInput('getNumber', 'International'));
    console.log(value);
  }

  change( $event ) {
    // Angular does not know that the value has changed
    // from our component, so we need to update her with the new value.
    console.log($event);
    this.onChange($event.target.textContent);
  }

  registerOnValidatorChange( fn: any ): void {
    this.onChange = fn;
  }

  setDisabledState( isDisabled: boolean ): void {
    const div = this.element.nativeElement;
    const action = isDisabled ? 'addClass' : 'removeClass';
    this.renderer[action](div, 'disabled');
  }

  ngOnInit() {
    const element = this.element.nativeElement;
      // tslint:disable-next-line:max-line-length
      if ((!!element.type && (element.type !== 'text' && element.type !== 'tel' && element.type !== 'number')) || element.tagName !== 'INPUT') {
        console.warn('ng-intl-tel-input can only be applied to a *text* or *tel* input');
        return;
      }
    this.iti = intlTelInput(this.element.nativeElement, {
      formatOnDisplay : true,
        utilsScript: 'assets/phonenumber_utils.js',
        initialCountry : 'auto',
        separateDialCode : true,
        geoIpLookup : function(callback) {
          $.get('https://ipinfo.io', function() {}, 'jsonp').always(function(resp) {
              const countryCode = (resp && resp.country) ? resp.country : '';
              callback(countryCode);
          });
      }
  });
  console.log(this.iti);
  console.log(this.element);
  const disabled = (element.disabled === true);
  if (disabled) {
      this.iti.options.customPlaceholder = function() {
          return '--N/A--';
      };
  } else {
      this.iti.options.customPlaceholder = function() {
          return 'Enter phone number';
    };
  }
  }
}
