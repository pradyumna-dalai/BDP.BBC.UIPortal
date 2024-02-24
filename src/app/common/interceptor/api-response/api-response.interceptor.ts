import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BDPAuthService } from '../../service/auth/auth.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class ApiResponseInterceptor implements HttpInterceptor {

  countError: number = 0;
  constructor(private authService: BDPAuthService, public messageService: MessageService) { this.countError = 0 }
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 403) {
      this.authService.logout();
      this.messageService.add({
        key: 'emptyToster',
        severity: 'error',
        life: 10000,
        summary: 'Error',
        detail: 'Session Expired!'
      });
    }
    return throwError(err);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => this.handleAuthError(err)));
  }
}
