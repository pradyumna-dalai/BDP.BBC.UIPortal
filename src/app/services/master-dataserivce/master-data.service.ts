import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as settings from "../../../app/common/lib/api-constants";

var url = "/buildingblocks/api/v1/"
@Injectable({
  providedIn: 'root'
})

export class MasterDataService {

  constructor(protected http: HttpClient) { }

  getAllLocationDetails() {
    return this.http.get<any>(url + settings.AppRoutes.Auth.getallLocations);
  }
  addChargecode(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.chargecode, body);
  }
  getAllChargecode(){
    return this.http.get<any>(url + settings.AppRoutes.Auth.chargecode);
  }
  editChargecode(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.chargecode, body);
  }
  
  deleteLocationDetails(locationId: number){
    const payload = { id: locationId, isDeleted: true };
    return this.http.delete<any>(url + settings.AppRoutes.Auth.deleteLocations,{ body: payload });
  }

  addLocations(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.addLocations,body);
  }

  //----------------------------For Scope-------------------------------------//
  addScopeDetails(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.addScope,body);
  }



  addChargecode(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.chargecode, body);
  }
  getAllChargecode(){
    return this.http.get<any>(url + settings.AppRoutes.Auth.chargecode);
  }
  editChargecode(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.chargecode, body);
  }
  


  deleteLocationDetails(locationId: number) {
    const payload = { id: locationId, isDeleted: true };
    return this.http.delete<any>(url + settings.AppRoutes.Auth.deleteLocations, { body: payload });
  }

  addLocations(body: any) {
    return this.http.post<any>(url + settings.AppRoutes.Auth.addLocations, body);
  }

  //----------------------------For Scope-------------------------------------//
  addScopeDetails(body: any) {
    return this.http.post<any>(url + settings.AppRoutes.Auth.addScope, body);
  }

  getScopeDetails(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return this.http.get<any>(url + settings.AppRoutes.Auth.getscope,{ params: httpParams});
  }
}
