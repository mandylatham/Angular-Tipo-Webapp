import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { Logger } from '../../common/logger.service';
import { AuthenticationService } from '../../common/authentication/authentication.service';

const log = new Logger('LoginComponent');

@Component({
  selector: 'tp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  error: string;
  registrationForm: FormGroup;
  isLoading = false;
  disabled = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
    this.registrationForm.get('companyName').valueChanges.subscribe(val => {
      this.registrationForm.controls['accountName'].setValue(
        val);
    });
  }

  ngOnInit() { }

  signup() {
    this.isLoading = true;
    this.authenticationService
      .signup({tipo_name: 'TipoRegistration', data: this.registrationForm.value})
      .subscribe(
        credentials => {
          log.debug(`${credentials} successfully logged in`);
          this.registrationForm.markAsPristine();
          this.login();
        },
        err => {
          log.debug(`Login error: ${err}`);
          this.isLoading = false;
          this.error = err.error.message;
        }
      );
  }

  login() {
    const authData = {
        username: this.registrationForm.value.email,
        password: this.registrationForm.value.password
    };
    this.authenticationService
      .login(authData)
      .subscribe(
        credentials => {
          log.debug(`${credentials} successfully logged in`);
          this.snackBar.open('A verification code is sent to your email!', '', {
            duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
          });
          this.router.navigate(['/verify-email'], { queryParams: { email: this.registrationForm.value.email } });
        },
        err => {
          log.debug(`Login error: ${err}`);
          this.isLoading = false;
          this.error = err.error.message;
        }
      );
  }

  routeTo () {
    this.router.navigate(['/login']);
  }

  private createForm() {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: ['', Validators.required],
      companyName: ['', Validators.required],
      accountName: ['', Validators.required],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }
}
