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
  getAllChargecode(): Observable<any>{
    
    return this.http.get<any>(url + settings.AppRoutes.Auth.chargecode);
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
  getAllProdcut(): Observable<any>{
   
    return this.http.get<any>(url + settings.AppRoutes.Auth.product);
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
  getAllUom(): Observable<any> {
  

    // Append params to the URL
    const apiUrl = url + settings.AppRoutes.Auth.uom;
    return this.http.get<any>(apiUrl);
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
  getAllLocationDetails(): Observable<any> {
    return this.http.get<any>(url + settings.AppRoutes.Auth.location);
    // return this.http.get<any>(url + settings.AppRoutes.Auth.location,{ params: httpParams});
  }

  downloadLocationDetails(){
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadLocation}`, { responseType: 'arraybuffer' as 'json' });
  }

  //----------------------------For Scope-------------------------------------//
  addScopeDetails(body: any) {
    return this.http.post<any>(url + settings.AppRoutes.Auth.scope, body);
  }

  getScopeDetails(): Observable<any> {
   
    return this.http.get<any>(url + settings.AppRoutes.Auth.scope);
  }

  updateScopeDetails(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.scope, body);
  }

  downloadScopeDetails(){
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadScope}`, { responseType: 'arraybuffer' as 'json' });
  }

  //----------------------Prduct Category------------------------------//
  getCategoryDetails(): Observable<any> {
  
    return this.http.get<any>(url + settings.AppRoutes.Auth.category);
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
  getAllFteDetails(): Observable<any> {
   
    return this.http.get<any>(url + settings.AppRoutes.Auth.fte);
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

  downloadCostDetails(){
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadCost}`, { responseType: 'arraybuffer' as 'json' });
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
  

    downloadRevenueDetails(){
      return this.http.get(`${url}${settings.AppRoutes.Auth.downloadRevenue}`, { responseType: 'arraybuffer' as 'json' });
    }
  
    //-----------------------------------end----------------------------------------//
}
