import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppRoutes } from '../../lib/api-constants';
import { BehaviorSubject } from 'rxjs';
import { UserApps } from '../../lib/common';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private UserApps: any[] = [];

  private userAppsPromise = new BehaviorSubject<any>(null);
  public $userAppsList = this.userAppsPromise.asObservable();

  constructor(private http: HttpClient,
    private storageService: StorageService) { }

  updateUserApps(value) {
    this.userAppsPromise.next(value);
  }

  getAllApps() {
    return this.http.get(AppRoutes.UserApi.GET_ALL_APPS);
  }

  getAppsList() {
    return JSON.parse(JSON.stringify(this.UserApps));
  }

  appHitLogging(body: any = {}) {
    let params = new HttpParams();
    params = params.append("appCode", UserApps.XCHANGE);
    let company = this.storageService.getItem("companyList");
    let currentUser = this.storageService.getItem("signinUser");
    let geIDs = company?.map(c => c.id);
    body = {
      applicationId: UserApps.XCHANGE,
      username: currentUser.email,
      geids: geIDs,
      companies: null
    }
    return this.http.post(AppRoutes.UserApi.APP_HIT_LOG, body, { params: params });
  }
}
