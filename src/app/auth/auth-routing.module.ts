import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { VerifyEmailComponent } from './verifyEmail/verifyEmail.component';
import { PasswordResetComponent } from './passwordReset/passwordReset.component';

const routes: Routes = [
  { path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },
  { path: 'register',
    component: RegistrationComponent,
    data: { title: 'Register' }
  },
  { path: 'verify-email',
    component: VerifyEmailComponent,
    data: { title: 'Verify Email' }
  },
  { path: 'forgot-password',
    component: PasswordResetComponent,
    data: { title: 'Reset Password', label: 'Email', buttonLabel: 'Send Verification Email', type: 'email', command: 'forgot_password' }
  },
  { path: 'resetpass',
    component: PasswordResetComponent,
    // tslint:disable-next-line:max-line-length
    data: { title: 'Reset Password', label: 'New Password', buttonLabel: 'Reset Password', type: 'password', command: 'confirm_forgot_password' }
  },
  { path: 'new-password-required',
    component: PasswordResetComponent,
    // tslint:disable-next-line:max-line-length
    data: { title: 'New Password Required', label: 'New Password', buttonLabel: 'Change Password', type: 'password', command: 'change_password' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AuthRoutingModule { }
