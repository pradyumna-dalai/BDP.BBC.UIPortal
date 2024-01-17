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
   //---------------------Charge Code----------------//
  addChargecode(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.chargecode, body);
  }
  getAllChargecode(params: any): Observable<any>{
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return this.http.get<any>(url + settings.AppRoutes.Auth.chargecode,{ params: httpParams});
  }
  editChargecode(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.chargecode, body);
  }
   //---------------------Prodcut----------------//
   addProdcut(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.product, body);
  }
  getAllProdcut(params: any): Observable<any>{
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return this.http.get<any>(url + settings.AppRoutes.Auth.product,{ params: httpParams});
  }
  editProduct(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.product, body);
  }  

  //---------------------uom----------------//
  addUom(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.uom, body);
  }
  getAllUom(params: any): Observable<any> {
    // Convert params to HttpParams
    let queryParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        queryParams = queryParams.append(key, params[key]);
      });
    }

    // Append params to the URL
    const apiUrl = url + settings.AppRoutes.Auth.uom;
    return this.http.get<any>(apiUrl, { params: queryParams });
  }
  editUom(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.uom, body);
  }
   //---------------------Locations----------------//
  addLocations(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.location,body);
  }

  updateLocations(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.location,body);
  }

  deleteLocationDetails(locationId: number){
    const payload = { id: locationId, isDeleted: true };
    return this.http.delete<any>(url + settings.AppRoutes.Auth.location,{ body: payload });
  }
  getAllLocationDetails() {
    return this.http.get<any>(url + settings.AppRoutes.Auth.location);
  }
  //----------------------------For Scope-------------------------------------//
  addScopeDetails(body: any) {
    return this.http.post<any>(url + settings.AppRoutes.Auth.scope, body);
  }

  getScopeDetails(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return this.http.get<any>(url + settings.AppRoutes.Auth.scope,{ params: httpParams});
  }

  updateScopeDetails(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.scope, body);
  }

  //----------------------Prduct Category------------------------------//
  getCategoryDetails(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return this.http.get<any>(url + settings.AppRoutes.Auth.category,{ params: httpParams});
  }

  addCateogoryDetails(body: any) {
    return this.http.post<any>(url + settings.AppRoutes.Auth.category, body);
  }

  updateCateogryDetails(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.category, body);
  }

  //-------------------------------------country----------------------//

  getAllCountryDetails() {
    return this.http.get<any>(url + settings.AppRoutes.Auth.country);
  }
}
