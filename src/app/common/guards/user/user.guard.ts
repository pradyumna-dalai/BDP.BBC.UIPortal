import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserTypes } from 'src/app/utility/user';
import { UserApps } from '../../lib/model';
import { BDPAuthService, StorageService } from '../../service';
import { UserService } from 'src/app/modules/auth/service';

@Injectable({
  providedIn: 'root'
})
export class UserGuardGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private bdpAuthService: BDPAuthService, private storageService: StorageService, private userService: UserService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.userService.getUser().pipe(map((response: any) => {
        let userData = response.data;
  
        this.storageService.setItem('userData', userData);
        // Check App access
        let approvedApps: string[] = userData?.userApps?.map(app => app.id.appCd);
          
        if(approvedApps?.length == 0 || !approvedApps?.includes(UserApps.XCHANGE)) {
          this.bdpAuthService.accessDeniedRedirect();
          return false;
        }  
        else if (userData?.activeYn == 'N') {
          this.bdpAuthService.reactivateRedirect();
          return false;
        }
        else return true;
      }), catchError((error) => {
        return of(false);
      }));
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return true
  }
}
