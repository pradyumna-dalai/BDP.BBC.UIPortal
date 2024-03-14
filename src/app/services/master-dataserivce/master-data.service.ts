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

  downloadChargeCodeDetails(){
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadChargecode}`, { responseType: 'arraybuffer' as 'json' });
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

  downloadProudctDetails(){
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadProduct}`, { responseType: 'arraybuffer' as 'json' });
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

  downloadUomDetails(){
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadUOM}`, { responseType: 'arraybuffer' as 'json' });
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
  getAllLocationDetails(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return this.http.get<any>(url + settings.AppRoutes.Auth.location,{ params: httpParams});
  }

  downloadLocationDetails(){
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadLocation}`, { responseType: 'arraybuffer' as 'json' });
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

  downloadScopeDetails(){
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadScope}`, { responseType: 'arraybuffer' as 'json' });
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

  
  downloadCategoryDetails(){
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadCategory}`, { responseType: 'arraybuffer' as 'json' });
  }
  //-------------------------------------country----------------------//
  getAllCountry(id:any) {
    return this.http.get<any>(url + `${id}/country`);
  }

  getLocationByCountry(countryId:number) {
    return this.http.get<any>(url + settings.AppRoutes.Auth.country+ `/${countryId}`);
  } 

  getAllCountryDetails(){
    return this.http.get<any>(url + settings.AppRoutes.Auth.country);
  }

  getAllLocationDropdown(){
    return this.http.get<any>(url + settings.AppRoutes.Auth.active_location);
  }

  /**Get FTE Details Api */
  getAllFteDetails(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return this.http.get<any>(url + settings.AppRoutes.Auth.fte,{ params: httpParams});
  }

  downloadFteDetails(){
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadfte}`, { responseType: 'arraybuffer' as 'json' });
  }

  updateFte(body:any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.fte,body);
  }

  addFteDetails(body:any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.fte,body);
  }

  //------------------------------ Process Configuration ------------------------//
  processConfigGetImportExcelData(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });
    return this.http.get<any>(url+settings.AppRoutes.Auth.getProcessConfigurable,{ params: httpParams});

  }

  saveProcess(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.saveProcessConfigurable, body);
  }

  //---------------------------------Cost Item Management---------------------//

  getAllCostItemDetails(){
    return this.http.get<any>(url + settings.AppRoutes.Auth.getAllcostItem);
  }

  saveCostItemDetails(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.saveCostItem, body);
  }

  updateCostItemDetails(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.saveCostItem, body);
  }

  //-----------------------------------end----------------------------------------//


    //---------------------------------Revenue Item Management---------------------//

    getAllRevenueDetails(){
      return this.http.get<any>(url + settings.AppRoutes.Auth.getAllRevenue);
    }
  
    saveRevenueDetails(body: any){
      return this.http.post<any>(url + settings.AppRoutes.Auth.saveRevenue, body);
    }
  
    updateRevenueDetails(body: any){
      return this.http.put<any>(url + settings.AppRoutes.Auth.saveRevenue, body);
    }
  
    //-----------------------------------end----------------------------------------//
}
