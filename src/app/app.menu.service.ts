import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as settings from "./../app/common/lib/api-constants";
var url = "/buildingblocks/api/v1/"

@Injectable({ providedIn: 'root'})

export class MenuService {
    constructor(private http: HttpClient) {}

    private menuSource = new Subject<string>();
    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    onMenuStateChange(key: string) {
        this.menuSource.next(key);
    }

    reset() {
        this.resetSource.next(true);
    }

    getMenuItems(): Observable<any> {
        return this.http.get<any>(url+settings.AppRoutes.Auth.getMenuItem);
      }
}
