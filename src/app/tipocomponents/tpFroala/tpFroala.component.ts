import { Component, OnInit, forwardRef, HostBinding, Inject, Input, Optional, Self, ViewChild, Injector } from '@angular/core';
import { NgControl, NgModel, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { ElementBase } from '../FormClasses';
import { TipoDataService } from '../../framework/services/tipodataservice/tipodata.service';

@Component({
  selector: 'tp-froala',
  template: `
    <textarea [froalaEditor]="options" (froalaModelChange)="onChange($event)" [(froalaModel)]="value"></textarea>
   `,
  providers: [{
    provide: MatFormFieldControl,
      useExisting: forwardRef(() => TpFroalaComponent)
  }]
})
export class TpFroalaComponent extends ElementBase<string> implements OnInit {

  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public options: any;
  @Input() public fieldValue: any;
  @Input() public datenumber: number;

  @ViewChild(NgModel) model: NgModel;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    @Optional() @Self() public ngControl: NgControl,
    private tipoDataService: TipoDataService
  ) {
    super(validators, asyncValidators, ngControl);
  }

  ngOnInit() {
    this.tipoDataService.getS3Signature().subscribe((data) => {
        this.options = {
            imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
            imageUploadToS3: data,
            key: 'kKC1KXDF1INBh1KPe2TK=='
        };
    });
  }
  // Begin ControlValueAccesor methods.
  onChange = (_) => {};
  onTouched = () => {};

  // Form model content changed.
  writeValue(content: any): void {
    this.model = content;
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  // End ControlValueAccesor methods.

  onContainerClick(event: MouseEvent) {
    // if ((event.target as Element).tagName.toLowerCase() != 'input') {
    //   this.elRef.nativeElement.querySelector('input').focus();
    // }
  }
}
