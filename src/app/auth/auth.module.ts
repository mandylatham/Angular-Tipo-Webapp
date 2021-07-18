import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { NgxCaptchaModule } from 'ngx-captcha';

import { MaterialModule } from '@app/material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from '../common/authentication/authentication.service';
import { AuthenticationGuard } from '../common/authentication/authentication.guard';
import { RegistrationComponent } from './registration/registration.component';
import { HeaderComponent } from './header/header.component';
import { VerifyEmailComponent } from './verifyEmail/verifyEmail.component';
import { PasswordResetComponent } from './passwordReset/passwordReset.component';
import { TipoComponentsModule } from '@app/tipocomponents';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    AuthRoutingModule,
    NgxCaptchaModule,
    TipoComponentsModule
  ],
  providers: [
    AuthenticationService,
    AuthenticationGuard
  ],
  declarations: [
    LoginComponent,
    RegistrationComponent,
    HeaderComponent,
    VerifyEmailComponent,
    PasswordResetComponent
  ]
})
export class AuthModule { }
