import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, mergeMap, map } from 'rxjs/operators';

export interface Credentials {
  // Customize received credentials here
  username: string;
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

export interface RegisterContext {
  tipo_name: string;
  data: object;
}

const credentialsKey = 'security_context';
const userContextKey = 'security_user_context';


@Injectable()
export class AuthenticationService {
  private _credentials: Credentials | null;
  private _user_meta ;
  private _sessionVariables;

  constructor(private http: HttpClient) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    const savedUserMeta = sessionStorage.getItem(userContextKey) || localStorage.getItem(userContextKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
    if (savedUserMeta) {
      this._user_meta = JSON.parse(savedUserMeta);
    }
  }

  /**
   * Authenticates the user.
   * context The login parameters.
   * The user credentials.
   */
  login(context: LoginContext): Observable<any> {
    return this.http.post<any>('/auth/d/tipotapp/tipoapp/',
      {
        'AuthFlow': 'ADMIN_NO_SRP_AUTH',
        'AuthParameters': {
          'USERNAME': context.username,
          'PASSWORD': context.password
        }
      })
      .pipe(mergeMap((response) => {
        if (response['AuthenticationResult']) {
        const userContext = {
          username: context.username,
          refreshToken: response['AuthenticationResult']['RefreshToken'],
          accessToken: response['AuthenticationResult']['AccessToken'],
          idToken: response['AuthenticationResult']['IdToken']
        };
        this.setCredentials(userContext, true);
        return this.http
        .authorize()
        .get('/api/TipoUser/default')
        .pipe(tap(result => {
          this.setUserContext(result['data']);
        }));
      } else {
        this._sessionVariables = response;
        return response;
      }
      }));
  }


  refreshLogin(): Observable<any> {
    return this.http.post<any>('/auth/d/tipotapp/tipoapp/',
    {
      'AuthFlow': 'REFRESH_TOKEN_AUTH',
      'AuthParameters': {
        'REFRESH_TOKEN': this.credentials.refreshToken
      }
    }).pipe(map((response) => {
      const updateCredentials = this.credentials;
      updateCredentials.accessToken = response['AuthenticationResult']['AccessToken'];
      updateCredentials.idToken = response['AuthenticationResult']['IdToken'];
      this.setCredentials(updateCredentials, true);
      return response;
    }));
  }

  newPassword(email, password): Observable<any> {
    return this.http.post<any>('/auth/d/tipotapp/tipoapp/',
    {
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      Session: this.sessionVariables.Session,
      ChallengeResponses: {
        NEW_PASSWORD : password,
        USERNAME : this.sessionVariables.ChallengeParameters.USER_ID_FOR_SRP
      }
  }).pipe(mergeMap((response) => {
      const updateCredentials = this.credentials;
      updateCredentials.username = email;
      updateCredentials.accessToken = response['AuthenticationResult']['AccessToken'];
      updateCredentials.idToken = response['AuthenticationResult']['IdToken'];
      this.setCredentials(updateCredentials, true);
      return response;
    }));
  }

  signup(context: RegisterContext): Observable<any> {
    return this.http.post<any>('/api/public/data/TipoRegistration', context);
  }

  resetPassword(url, data): Observable<any> {
    return this.http.post<any>(url, data);
  }

  verifyEmail(url, data): Observable<any> {
    return this.http
    .authorize()
    .put<any>(url, data);
  }

  /**
   * Logs out the user and clear credentials.
   * True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    this.setCredentials();
    this.setUserContext();
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   *True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials && !!this.user_meta;
  }

  /**
   * Gets the user credentials.
   * The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  get user_meta() {
    return this._user_meta;
  }

  get sessionVariables() {
    return this._sessionVariables;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   *  The user credentials.
   *  remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  private setUserContext(user_meta? , remember?: boolean) {
    this._user_meta = user_meta || null;
    if (user_meta) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(userContextKey, JSON.stringify(user_meta));
    } else {
      sessionStorage.removeItem(userContextKey);
      localStorage.removeItem(userContextKey);
    }
  }
}
