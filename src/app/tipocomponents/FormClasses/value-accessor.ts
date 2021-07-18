import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { HostBinding, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';
import { Subject } from 'rxjs';

export abstract class ValueAccessorBase<T> extends MatFormFieldControl<T> implements ControlValueAccessor, OnDestroy {

  // Implementing MatFormFieldControl



  private innerValue: T;
  private _defaultvalue: T;
  private changed = new Array<(value: T) => void>();
  private touched = new Array<() => void>();

  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;

  get empty() {
    const n = this.innerValue;
    return !n;
  }

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private _required = false;

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return true;
  }

  @HostBinding('attr.aria-describedby') describedBy = '';

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  // Implementing ControlValueAccessor

  get value(): T {
    return this.innerValue;
  }

  set value(value: T) {
    if (this.innerValue !== value) {
      this.innerValue = value;
      this.changed.forEach(f => f(value));
    }
    this.stateChanges.next();
  }

  writeValue(value: T) {
    if (value) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: (value: T) => void) {
    this.changed.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this.touched.push(fn);
  }

  touch() {
    this.touched.forEach(f => f());
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl,
  ) {
    super();
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  // Implementing TipoComponentStandards

  @Input()
  get defaultvalue() {
    return this._defaultvalue;
  }
  set defaultvalue(val) {
    this._defaultvalue = val;
    this.innerValue = val;
    this.stateChanges.next();
  }
  // OnDestroy

  ngOnDestroy() {
    this.stateChanges.complete();
  }
}
