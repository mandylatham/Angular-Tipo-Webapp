import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { Logger } from '../../common/logger.service';
import { AuthenticationService } from '../../common/authentication/authentication.service';

const log = new Logger('LoginComponent');

@Component({
  selector: 'tp-verify-email',
  templateUrl: './verifyEmail.component.html',
  styleUrls: ['./verifyEmail.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  error: string;
  verifyEmailForm: FormGroup;
  isLoading = false;
  queryParams;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      console.log(params);
      this.queryParams = params;
    });
  }

  verify() {
    this.isLoading = true;
    const url = '/api/AppUser/' + this.queryParams.params.email + '?tipo_action=changePassword';
    const data = {
      tipo_name: 'TipoPassword',
      data: {
        accessToken: this.authenticationService.credentials.accessToken,
        confirmationcode: this.verifyEmailForm.value.code,
        command: 'confirm_code'
      }
    };
    this.authenticationService
      .verifyEmail(url, data)
      .subscribe(
        response => {
          this.router.navigate(['/dashboard'], { replaceUrl: true, queryParams: { perspective: 'Home' } });
        },
        err => {
          console.log(err);
          this.isLoading = false;
          this.error = err.error.message;
        }
      );
  }

  routeTo () {
    this.router.navigate(['/register']);
  }

  resend () {
    const url = '/api/AppUser/' + this.queryParams.params.email + '?tipo_action=changePassword';
    const data = {
      tipo_name: 'TipoPassword',
      data: {
          username: this.queryParams.params.email,
          accessToken: this.authenticationService.credentials.accessToken,
          command: 'resend_code'
      }
    };
    this.authenticationService
      .verifyEmail(url, data)
      .subscribe(
        response => {
          this.snackBar.open('A verification code is sent to your email!', '', {
            duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
          });
        },
        err => {
          console.log(err);
          this.error = err.error.message;
        }
      );
  }

  private createForm() {
    this.verifyEmailForm = this.formBuilder.group({
      code: ['', Validators.required],
    });
  }
}
