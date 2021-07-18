import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subscriber } from 'rxjs';

import { AuthenticationService } from '../authentication/authentication.service';

/**
 * Authorize HTTP requests.
 * Use ExtendedHttpClient fluent API to configure auth for each request.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const credentials = this.authenticationService.credentials;
    request = request.clone({
      setHeaders: {
        SessionId: credentials.accessToken,
        Authorization: credentials.idToken
      }
    });
    return next.handle(request);
  }
}
