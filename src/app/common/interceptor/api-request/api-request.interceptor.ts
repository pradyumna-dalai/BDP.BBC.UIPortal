import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpRequest,HttpHandler,HttpHeaders, HttpEvent,HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { BDPAuthService } from '../../service/auth/auth.service';
import { StorageService } from '../../service/storage/storage.service';
import { AppRoutes } from '../../lib';


@Injectable()
export class ApiRequestInterceptor implements HttpInterceptor {

  constructor(
    public storageService: StorageService,
    public authService: BDPAuthService,
    public router: Router) {
      router.events.subscribe(event => {});
    }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tokenDetails = this.storageService.getItem('token');
    const umpUrls = [
      AppRoutes.UserApi.GET_CURRENT_USER,
      AppRoutes.UserApi.IS_PASSWORD_EXPIRED,
      AppRoutes.UserApi.EULA_VALIDATE,
      AppRoutes.UserApi.IS_APP_PERMITTED,
      AppRoutes.UserApi.GET_ALL_APPS,
      AppRoutes.UserApi.APP_HIT_LOG
    ]

    if (!/^(http|https):/i.test(request.url)) {
    
      let url = '';
      const headers: any = {
        'Authorization': tokenDetails != null && tokenDetails !== '' ? 'Bearer ' + tokenDetails : '',
       // 'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      };

      if (umpUrls.indexOf(request.url) >= 0) {
        url = environment.ump_endpoint_url + request.url;
      } else {
        url = environment.endpoint_url + request.url;
        headers['Content-Type'] = 'application/json';
      }
      
      request = request.clone({
        url,
        headers: new HttpHeaders(headers)
      });
    }
    // this.userService.updateUserActivity();
    return next.handle(request).pipe(takeUntil(this.authService.onCancelPendingRequests()));
  }
}
