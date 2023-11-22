import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpRequest,HttpHandler,HttpHeaders, HttpEvent,HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';
import { StorageService } from '../../service/storage/storage.service';
import * as moment from 'moment';

@Injectable()
export class ApiRequestInterceptor implements HttpInterceptor {

  constructor(
    public storageService: StorageService,
    public authService: AuthService,
    // public userService:UserService,
    public router: Router) {
      router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (event.url == '/login') {
            //cancle all api calls when logout
            // this.authService.cancelPendingRequests();
          }
        }
      });
    }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const tokenDetails = this.storageService.getItem('token');
    const authUrls = [];
    

    if (!/^(http|https):/i.test(request.url)) {
      console.log("kk");
      AuthService.lastApiCall = moment();
      let url = '';
      
        url = environment.endpoint_url + request.url
      
      const headers: any = {
        'Authorization': tokenDetails != null && tokenDetails !== '' ? 'Bearer ' + tokenDetails : '',
       // 'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      };
      
      request = request.clone({
        url,
        headers: new HttpHeaders(headers)
      });
    }
    // this.userService.updateUserActivity();
    return next.handle(request).pipe(takeUntil(this.authService.onCancelPendingRequests()));
  }
}
