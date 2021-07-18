import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { Logger } from '../logger.service';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(private injector: Injector) { }
  authenticationService: any;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.errorHandler(error, next, request)));
  }

  private errorHandler(response: HttpEvent<any>, next, request): Observable<HttpEvent<any>> {
    // Do something with the error
    log.error('Request error', response);
    if (response['status'] !== 401) {
      throw response;
    }
    this.authenticationService = this.injector.get(AuthenticationService);
    if (this.refreshTokenInProgress) {
      return this.refreshTokenSubject
        .pipe(
          filter(result => result !== null),
          take(1),
          switchMap(() => next.handle(request))
        );
    } else {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);
      return this.authenticationService
        .refreshLogin()
        .subscribe((token) => {
          this.refreshTokenInProgress = false;
          this.refreshTokenSubject.next(token);

          return next.handle(request);
        },
        (err: any) => {
          this.refreshTokenInProgress = false;
          this.authenticationService.logout();
          throw response;
        });
    }
    if (response['status'] === 401) {
      return this.authenticationService
        .refreshLogin()
        .subscribe(refresh => {

        });
      return of(response);
    }
    // return response;
    throw response;
  }
}
