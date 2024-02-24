import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from 'src/app/modules/auth/service';
import { BDPAuthService } from 'src/app/modules/shared/service/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordGuard implements CanActivate {

  constructor(
    private bdpAuthService: BDPAuthService,
    private userService: UserService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.isPasswordExpired().pipe(map((isExpired: any) => {
      if (isExpired) {
        this.bdpAuthService.forceChangePassowrdRedirect();
        return false;
      }
      return true;
    }), catchError((error) => {
      return of(false);
    }));
  }

}
