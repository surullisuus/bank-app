import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { Injectable } from '@angular/core';

import {
  Observable,
  catchError,
  throwError
} from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(

      catchError((error: HttpErrorResponse) => {

        let errorMessage = 'Unexpected error occurred';

        if (error.error?.message) {
          errorMessage = error.error.message;
        }

        if (error.status === 0) {
          errorMessage = 'Cannot connect to server';
        }

        if (error.status === 404) {
          errorMessage = 'Resource not found';
        }

        if (error.status === 400) {
          errorMessage = 'Invalid request';
        }

        console.error('HTTP Error:', error);

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
