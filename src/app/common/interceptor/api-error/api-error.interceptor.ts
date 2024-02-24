import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BDPAuthService, StorageService } from '../../service';
import { AppRoutes } from 'src/app/constants/api-constants';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {

  constructor(
    private bdpAuthService: BDPAuthService,
    private router: Router,
    private storageService: StorageService,
    // private userSettingsService: UserSettingsService,
    // public dialogService: DialogService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
      }
    },
      (err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 403: {
              this.router.navigate([AppRoutes.AuthAbstract.ACCESS]);
              break;
            }
            case 401: {
              this.bdpAuthService.logout(true);
              // throw new Error('Your Session has expired, please log in again.');
              break;
            }
            case 404:
            case 400: {
              console.log(err);
              break;
            }
            case 503: {
              this.router.navigate([AppRoutes.AuthAbstract.MAINTENANCE]);
              console.log(err);
              break;
            }
            case 417: {
              // this.dialogService.showToaster({
              //   severity: ToasterSeverity.ERROR,
              //   life: 10000,
              //   summary: 'Error Message',
              //   detail: err.error.message
              // });
              console.log(err);
              break;
            }
            case 500: {
              // this.dialogService.showToaster({
              //   severity: ToasterSeverity.ERROR,
              //   life: 10000,
              //   summary: 'Error Message',
              //   detail: "Something Went Wrong."
              // });
              console.log(err);
              break;
            }
            case 0: {
              this.pageBreakRedirect(err);
              break;
            }
            default: {
              this.pageBreakRedirect(err);
            }
          }
        }
      })
    );
  }

  private pageBreakRedirect(err) {
    console.log(err);
    if (err.url.includes(environment.endpoint_url)) {
      // if (this.bdpAuthService.token)
      //   this.router.navigate([AppRoutes.AuthAbstract.APP_PAGE_BREAK]);
      // else
      this.router.navigate([AppRoutes.AuthAbstract.PAGE_BREAK]);
    }
    else {
      throw err;
    }
  }
}
