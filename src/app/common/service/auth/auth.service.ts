import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from "../storage/storage.service";
import { AppRoutes } from "../../../constants/api-constants";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { environment } from "src/environments/environment";
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { UtilityService } from "../utility/utility.service";
import { InactivityService } from "../inactivity/inactivity.service";
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class BDPAuthService {

  public static lastApiCall: any = null;
  private schedule: any
  private user: any = null;
  private userPromise = new BehaviorSubject<any>(this.user);
  public $user = this.userPromise.asObservable();

  private pendingHTTPRequests$ = new Subject<void>();

  private isSessionCheckActive: boolean = true;

  constructor(
    public router: Router,
    protected http: HttpClient,
    private storageService: StorageService,
     /** Auth0 */
     public auth: Auth0Service,
     private inactivityService: InactivityService,
     @Inject(DOCUMENT) private document: Document,
  ) { }

  public checkAuth() {
    return true;                                //Check user state 
  }

  public get token() {
    return this.storageService.getItem("token");
  }

  /**
   * Redirect to Login after logout
   */
  public logoutRedirect() {
    this.router.navigate(['/']); //Auth0
  }

  /**
   * Redirect to Login after logout
   */
  public loginRedirect() {
    this.router.navigate(['/']); //Auth0
  }

  /**
   * Password confirmation for the user
   */
  public passwordResetConfirmNav() {

  }

  //#region PUBLIC METHODS FOR API CALL FOR AUTHENTICATION
  //Logout method removing the email, passowrd, token, keepsignin and state
  public logout(persistState: boolean = false) {
    const rememberEmail = this.storageService.getItem('rememberEmail');
    const email = this.storageService.getItem('email');
    localStorage.clear();
    this.storageService.setItem('rememberEmail', rememberEmail);
    this.storageService.setItem('email', email);
    
    if (persistState) {
      this.storageService.setItem("lastVisitedPage", window.location.href.split("#").pop());
    }
    this.auth.logout({ federated: true, returnTo: document.location.origin });
  }

  public onCancelPendingRequests() {
    return this.pendingHTTPRequests$.asObservable();
  }

  //#endregion

  public changePasswordRedirect() {
    let params = {
      returnTo: window.location.href
    };
    let token = UtilityService.convertToBase64(JSON.stringify(params));
    window.open(`${environment.smartHubUrl}${AppRoutes.UserFull.CHANGE_PASSWORD}/?token=${token}`, '_self').focus();
  }

  public forceChangePassowrdRedirect() {
    let params = {
      returnTo: window.location.origin
    };
    let token = UtilityService.convertToBase64(JSON.stringify(params));
    window.open(`${environment.smartHubUrl}${AppRoutes.UserFull.COMMON_CHANGE_PASSWORD}/?token=${token}`, '_self').focus();
  }

  public profileRedirect() {
    let params = {
      returnTo: window.location.origin
    };
    let token = UtilityService.convertToBase64(JSON.stringify(params));
    window.open(`${environment.smartHubUrl}${AppRoutes.UserFull.PROFILE}/?token=${token}`, '_self').focus();
  }

  /**
   * Redirect to Smart hub reactivate form page
   */
  public reactivateRedirect() {
    this.document.location.href = `${environment.smartHubUrl}${AppRoutes.AuthFull.REACTIVATE_ACCOUNT}`;
  }

  /**
 * Redirect to Access Denied page
 */
  public accessDeniedRedirect() {
    this.router.navigate([AppRoutes.AuthAbstract.ACCESS])
  }

  /**
   * This method contains triggers when the user is inactive for more than 2 mins
   * Triggers should be activated only when the user has logged in
   * One is idle trigger and the other is wake trigger
   * 
   * When Idle : The session check every 5 mins is disabled
   * When wake : When the user wakes the applicaiton after being idle then it
   *    should call the silent authenticaiton method to make sure the user stays loggedIn
   *    otherwise auth0 will log out the user after 15 mins of inactivity.
   */
  public checkInactivityStatus() {
    this.inactivityService.idle$.subscribe({
      next: (res) => {
        const duration = Math.floor(res.duration / (60 * 1000))
        if (res.isIdle) {
          console.log(`User has been idle for ${duration} minutes`)
          this.isSessionCheckActive = false;
        }
      }
    })
    this.inactivityService.wake$.subscribe({
      next: (res) => {
        if (res && res.isActive) {
          this.isSessionCheckActive = true;
          const duration = Math.floor(res.duration / (60 * 1000))
          if (duration && duration > 5) {
            this.silentAuthentication();
          }
        }
      }
    })
  }

  /**
   * This method will check the authentication status at an interval to check
   * if the user is authenticated or not.
   */
  public checkAuthenticationStatus() {
    interval(environment.sessionTimeoutInterval).subscribe(() => {
      if (this.isSessionCheckActive) {
        this.silentAuthentication();
      }
    });
  }

  /**
   * Silently calls the token to check if the user is authenticated on not.
   * It direclty hits the auth0 authorization server to check the authentication status
   * so use this method only if necessary and NOT too frequently.
   */
  public silentAuthentication() {
    let options = { ignoreCache: true };
    this.auth.getAccessTokenSilently(options).subscribe({
      next: (res) => { this.storageService.setItem("token", res) },
      error: () => this.logout()
    });
  }

  public login(user) {
    /** Auth0 */
    this.auth.loginWithRedirect({ responseType: 'code' }).subscribe((res: any) => {
      console.log(res);
    }), (err) => {
      this.logout();
    };
    return this.auth.idTokenClaims$;
  }
  
}
