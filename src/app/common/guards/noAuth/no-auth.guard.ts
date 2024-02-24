import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { BDPAuthService } from '../../service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate, CanLoad {
  constructor(
    protected authService: BDPAuthService,
    protected router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.token) {
      this.authService.loginRedirect();
      return false;
    } else {
      return true;
    }
  }

  //This method will reload page without authentication required
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.token) {
      this.authService.loginRedirect();
      return false;
    } else {
      return true;
    }
  }
}
