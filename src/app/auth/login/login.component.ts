import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { Logger } from '../../common/logger.service';
import { AuthenticationService } from '@app/common';

const log = new Logger('LoginComponent');

@Component({
  selector: 'tp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error: string;
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.createForm();
  }

  ngOnInit() { }

  login() {
    this.isLoading = true;
    this.authenticationService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        credentials => {
          console.log(credentials);
          if (credentials.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
            // tslint:disable-next-line:max-line-length
            this.router.navigate(['/new-password-required'], { queryParams: { email: this.loginForm.value.username } });
          } else if (credentials.ChallengeName === 'EMAIL_VERIFICATION_REQUIRED') {
            this.router.navigate(['/verify-email'], { queryParams: { email: this.loginForm.value.username } });
          } else {
          this.router.navigate(['/dashboard'], { replaceUrl: true, queryParams: { perspective: 'Home' } });
          }
        },
        err => {
          log.debug(`Login error: ${err}`);
          this.error = err.error.message;
        }
      );
  }

  routeTo () {
    this.router.navigate(['/register']);
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }
}
