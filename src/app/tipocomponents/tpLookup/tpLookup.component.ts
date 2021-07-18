import { Component, forwardRef, Inject, Input, OnInit, Optional, Self, ViewChild } from '@angular/core';
import { NgControl, NgModel, NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { Logger } from '@app/common';
import { TipoHandleService } from '@app/framework/services';
import { ElementBase } from '../FormClasses';



const log = new Logger('tpLookup');

export interface Lookup {
  key: string;
  value: string;
}

@Component({
  selector: 'tp-lookup',
  templateUrl: './tpLookup.component.html',
  styleUrls: ['./tpLookup.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => TpLookupComponent)
    }]
})
export class TpLookupComponent extends ElementBase<Lookup> implements OnInit {
  @Input() public label?: string;
  @Input() public basefilter?: string;
  @Input() public realtedtipo: string;
  @Input() public queryparams?: any[];
  @Input() public selectkeyfield?: string;
  @Input() public selectlabelfield?: string;
  @Input() public meaningful_key?: string;
  public key_field = this.selectkeyfield || 'tipo_id';
  public label_field = this.selectlabelfield || this.meaningful_key || 'tipo_id';
  public options: any[] = [];

  @ViewChild(NgModel) model: NgModel;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
    @Optional() @Self() public ngControl: NgControl,
    private tipoHandleService: TipoHandleService
  ) {
    super(validators, asyncValidators, ngControl);
  }

  ngOnInit() {
    this.getOptions();
  }

  getOptions() {
    this.tipoHandleService.getTipos(this.realtedtipo, {}).subscribe((response) => {
      log.debug('response', response);
      this.options = response.map(resp => {
        return { key: resp[this.key_field], value: resp[this.key_field] };
      });
    });
  }

  onContainerClick(event: MouseEvent) {
    // if ((event.target as Element).tagName.toLowerCase() != 'input') {
    //   this.elRef.nativeElement.querySelector('input').focus();
    // }
  }
}
