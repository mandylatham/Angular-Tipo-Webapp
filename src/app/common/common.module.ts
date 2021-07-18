import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { HttpService } from './http/http.service';
import { HttpCacheService } from './http/http-cache.service';
import { AuthInterceptor } from './http/auth.interceptor';
import { ErrorHandlerInterceptor } from './http/error-handler.interceptor';
import { CacheInterceptor } from './http/cache.interceptor';
import { RouteReusableStrategy } from './route-reusable-strategy';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationGuard } from './authentication/authentication.guard';



@NgModule({
  imports: [CommonModule, HttpClientModule, RouterModule],
  providers: [
    AuthenticationService,
    AuthenticationGuard,
    AuthInterceptor,
    HttpCacheService,
    ErrorHandlerInterceptor,
    CacheInterceptor,
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    }
  ]
})
export class TipoCommonModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: TipoCommonModule
  ) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Common module in the AppModule only.`);
    }
  }
}
