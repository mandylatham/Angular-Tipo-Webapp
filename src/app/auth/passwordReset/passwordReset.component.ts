import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AuthenticationService } from '../../common/authentication/authentication.service';
import { finalize } from 'rxjs/operators';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'tp-password-reset',
  templateUrl: './passwordReset.component.html',
  styleUrls: ['./passwordReset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  error: string;
  passwordResetForm: FormGroup;
  isLoading = false;
  context: object;
  queryParams: any;
  user;

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
      this.queryParams = params;
    });
    this.activatedRoute.data.subscribe((data) => {
      this.context = data;
    });
  }

  verify(command) {
    this.isLoading = true;
    let data, url ;
    if (command === 'forgot_password') {
      url = '/api/public/data/TipoRegistration';
      data = {
        tipo_name: 'TipoRegistration',
        data: {
            username: this.passwordResetForm.value.text,
            command: 'forgot_password'
        }
      };
      this.process(command, url, data);
    } else if (command === 'confirm_forgot_password') {
      url = '/api/public/data/TipoRegistration';
      data = {
        tipo_name: 'TipoRegistration',
        data: {
            username: this.queryParams.params.email,
            confirmationcode : this.passwordResetForm.value.code,
            password : this.passwordResetForm.value.text,
            command: 'confirm_forgot_password'
        }
      };
      this.process(command, url, data);
    } else if (command === 'change_password') {
      this.newPassword();
    }
  }

  process(command, url, data) {
    this.authenticationService
      .resetPassword(url, data)
      .subscribe(
        response => {
          if (command === 'forgot_password') {
            this.snackBar.open('A verification code to reset your password is sent to your email!', '', {
              duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
            });
            this.router.navigate(['/resetpass'], { queryParams: { email: this.passwordResetForm.value.text }});
          } else if (command === 'confirm_forgot_password') {
            this.snackBar.open('Password changed successfully!', '', {
              duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'
            });
            const authData = {
              username : this.queryParams.params.email,
              password : this.passwordResetForm.value.text
            };
            this.login(authData);
          }
        },
        err => {
          console.log(err);
          this.isLoading = false;
          this.error = err.error.message;
        }
      );
  }

  login(authData) {
    this.authenticationService.login(authData)
    .subscribe(
      res => {
        this.router.navigate(['/dashboard'], { replaceUrl: true, queryParams: { perspective: 'Home' } });
      },
      err => {
        this.isLoading = false;
        this.error = err.error.message;
      }
      );
  }

  newPassword () {
    this.authenticationService.newPassword(this.queryParams.params.email, this.passwordResetForm.value.text)
    .subscribe(
      res => {
        this.router.navigate(['/dashboard'], { replaceUrl: true, queryParams: { perspective: 'Home' } });
      },
      err => {
        this.isLoading = false;
        this.error = err.error.message;
      }
      );
  }

  routeTo () {
    this.router.navigate(['/register']);
  }

  private createForm() {
    this.passwordResetForm = this.formBuilder.group({
      text: [''],
      code: ['']
    });
  }
}
