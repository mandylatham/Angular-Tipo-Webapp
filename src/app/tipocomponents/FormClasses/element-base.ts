import { Optional, Self } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncValidatorArray, message, validate, ValidationResult, ValidatorArray } from './validate';
import { ValueAccessorBase } from './value-accessor';





export abstract class ElementBase<T> extends ValueAccessorBase<T> {
  protected abstract model: NgModel;

  constructor(
    private validators: ValidatorArray,
    private asyncValidators: AsyncValidatorArray,
    @Optional() @Self() public ngControl: NgControl
  ) {
    super(ngControl);
  }

  protected validate(): Observable<ValidationResult> {
    return validate
      (this.validators, this.asyncValidators)
      (this.model.control);
  }

  protected get invalid(): Observable<boolean> {
    return this.validate().pipe(map(v => Object.keys(v || {}).length > 0));
  }

  protected get failures(): Observable<Array<string>> {
    return this.validate().pipe(map(v => Object.keys(v).map(k => message(v, k))));
  }
}
