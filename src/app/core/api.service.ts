import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { throwError, Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AppHttpUrlEncodingCodec } from './shared/app-http-url-encoding-codec';
import { PaginatedDataParams } from './shared/paginated-data-params';
import { SessionService } from './session.service';

export interface ApiOptions {
  headers?: {
    [header: string]: string | string[];
  };
  params?: {
    [param: string]: string | string[];
  };
  throwError?: boolean;
  displayError?: boolean;
}

interface ApiHttpOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
}

@Injectable()
export class ApiService {
  private readonly AUTH_HEADER_NAME = 'authorization';
  private readonly encoder = new AppHttpUrlEncodingCodec();

  static normalizePaginatedDataParams(params: PaginatedDataParams) {
    if (!params) {
      return null;
    }

    const result = {};

    Object.keys(params).forEach(paramName => {
      if (!params[paramName]) {
        return;
      }

      if (paramName === 'sortOrder') {
        result[paramName] = params[paramName] === 1 ? 'asc' : 'desc';
      } else {
        result[paramName] = params[paramName].toString();
      }
    });

    return result;
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private sessionService: SessionService,
  ) {
  }

  get<T>(url: string, options?: ApiOptions): Observable<T> {
    let requestOptions: ApiHttpOptions;
    try {
      requestOptions = this.getRequestOptions(options);
    } catch (error) {
      return EMPTY;
    }

    return this.http
      .get<T>(this.getUrl(url), requestOptions)
      .pipe(catchError(response => this.handleErrorResponse(response, options)));
  }

  post<T>(url: string, body: any | null, options?: ApiOptions): Observable<T> {
    let requestOptions: ApiHttpOptions;
    try {
      requestOptions = this.getRequestOptions(options);
    } catch (error) {
      return EMPTY;
    }

    return this.http
      .post<T>(this.getUrl(url), body, requestOptions)
      .pipe(catchError(response => this.handleErrorResponse(response, options)));
  }

  put<T>(url: string, body: any | null, options?: ApiOptions): Observable<T> {
    let requestOptions: ApiHttpOptions;
    try {
      requestOptions = this.getRequestOptions(options);
    } catch (error) {
      return EMPTY;
    }

    return this.http
      .put<T>(this.getUrl(url), body, requestOptions)
      .pipe(catchError(response => this.handleErrorResponse(response, options)));
  }

  delete<T>(url: string, options?: ApiOptions): Observable<T> {
    let requestOptions: ApiHttpOptions;
    try {
      requestOptions = this.getRequestOptions(options);
    } catch (error) {
      return EMPTY;
    }

    return this.http
      .delete<T>(this.getUrl(url), requestOptions)
      .pipe(catchError(response => this.handleErrorResponse(response, options)));
  }

  private getUrl(url: string): string {
    return `${environment.apiUrl}/${url}`;
  }

  private getRequestOptions(opt: ApiOptions = {}): ApiHttpOptions {
    const options: ApiHttpOptions = {};
    options.headers = this.getHeaders(opt.headers);
    if (opt.params) {
      options.params = this.buildParams(opt.params);
    }
    return options;
  }

  private getHeaders(headers?: { [header: string]: string | string[] }): HttpHeaders {
    if (!headers) {
      const token = this.sessionService.getAuthToken();
      if (token) {
        headers = { [this.AUTH_HEADER_NAME]: `Bearer ${token}` };
      }
    }

    return new HttpHeaders(headers);
  }

  private buildParams(params: { [param: string]: string | string[] }): HttpParams {
    return new HttpParams({
      fromObject: params,
      encoder: this.encoder,
    });
  }

  private handleErrorResponse(response: HttpErrorResponse, options: ApiOptions = {}) {

    switch (true) {
      case options.throwError:
        return throwError(response);
      case response.status === 401 && !location.origin.match(/our-community|about/gi):
        this.sessionService.endSession();
        this.router.navigate(['/']);
        return EMPTY;

      case response.status === 423:
        this.router.navigate(['/service-unavailable']);
        return EMPTY;

      case response.status >= 500:
        this.toastr.error('Unexpected server error');
        return EMPTY;

      case options.displayError && !!response.error.message:
        this.toastr.error(response.error.message);
        return throwError(response);

      default:
        return throwError(response);
    }
  }
}
