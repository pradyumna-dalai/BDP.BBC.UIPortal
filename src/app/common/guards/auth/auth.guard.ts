import { Injectable } from '@angular/core';
import { Route,Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanActivateChild, UrlSegment } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { BDPAuthService, StorageService } from '../../service';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild, CanActivate {
  constructor(
    private auth: AuthService,
    private authService: BDPAuthService,
    private storageService: StorageService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const authenticate = this.authService.checkAuth();
    return this.auth.idTokenClaims$.pipe(map((res: any) => {
      if (res)
        this.storageService.setItem('token', res.__raw);

      return true;
    }), catchError((error) => {
      return of(false);
    }));
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const authenticate = this.authService.checkAuth();
    if (!authenticate) {
      this.authService.logoutRedirect();
    }
    return authenticate;
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const authenticate = this.authService.checkAuth();
    if (!authenticate) {
      this.authService.logoutRedirect();
    }
    return authenticate;
  }
}
