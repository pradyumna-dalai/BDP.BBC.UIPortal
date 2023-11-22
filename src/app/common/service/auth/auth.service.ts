import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from "../storage/storage.service";
import { RouterStateSnapshot } from "@angular/router";
import {  AppRoutes } from "../../lib/api-constants";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, from, Observable, of, Subject, throwError } from 'rxjs';
import { Message } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static lastApiCall: any = null;
  private schedule: any
  private user: any = null;
  private userPromise = new BehaviorSubject<any>(this.user);
  public $user = this.userPromise.asObservable();

  private pendingHTTPRequests$ = new Subject<void>();

  constructor(
    public router: Router,
    protected http: HttpClient,
    private storageService: StorageService,
  ) { }

  //#region PUBLIC METHODS
  // public get token() {
  //   return this.storageService.getItem("token");//Get the token from storage
  // }

  // public setToken(token: string) {
  //   this.storageService.setItem("token", token);//Set the token while loggin for first time
  // }

  public checkAuth(state: RouterStateSnapshot) {
    return true;                                //Check user state 
  }

  // public loginRedirect() {
  //   let user = "customer";
  //   this.router.navigate([AppRoutes.UserFull.ROOT]);
  // }

  /**
   * Redirect to Login after logout
   */
  public logoutRedirect() {
    window.location.replace(`/`);
  }

  /**
   * Password confirmation for the user
   */
  public passwordResetConfirmNav() {

  }

  /**
   * Resend link for the user
   */
  public passwordResendNav() {
  }
  //#endregion

  //#region PUBLIC METHODS FOR API CALL FOR AUTHENTICATION
  //Logout method removing the email, passowrd, token, keepsignin and state
  public logout() {

    clearInterval(this.schedule);

    // const rememberEmail = this.storageService.getItem('rememberEmail');
    // let email = this.storageService.getItem('email');
    // const recentShipment = this.storageService.getItem('recentShipment-' + email);
    // const redirectUrl = this.storageService.getItem('redrectUrl');
    localStorage.clear();

    //Do not clear below fields rememberEmail,email,recentShipment we need it after login. 
    // this.storageService.setItem('rememberEmail', rememberEmail);
    // this.storageService.setItem('email', email);
    // this.storageService.setItem('recentShipment-' + email, recentShipment);
    // this.storageService.setItem('redirectUrl', redirectUrl);

    this.signOut();

    this.logoutRedirect();
  }

  public login(body: any) {
  }

  public getUser() {
    return this.user;
  }

  public onCancelPendingRequests() {
    return this.pendingHTTPRequests$.asObservable();
  }

  public resetPassword(payload: any) {
    return of({});
  }


  public register(payload: any) {
    return of({});
  }
  //#endregion


  private signOut() {
    // TODO API call to signout from the current session.
    console.log("SIGN OUT CALLED");
  }

  public refreshSession() {
    // Get currentToken
    let refreshToken = this.getRefreshToken();
    //refreshSession
    this.refreshCurrentSession(refreshToken);

  }

  private getRefreshToken() {
    /*
    Auth.currentSession().then((res) => {
      if (res)
        refreshToken = res.getRefreshToken()
    }).catch(err => console.log(err))
    */
    return "";
  }

  private refreshCurrentSession(refreshToken) {
    /*
    Auth.currentAuthenticatedUser()
      .then((user: CognitoUser) => {
        user.refreshSession(refreshToken, (err, session) => {
          if (err)
            console.log('In the err' + err);
          else {
            this.storageService.setItem('token', session.idToken.jwtToken);
            console.log('session ' + session);
          }
      });
    })
    */
    let session = "mock_Session" // TODO get session details from API
    console.log('session ' + session);
  }
}
