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

  getAllLocationDetails(){
    return this.http.get<any>(url + settings.AppRoutes.Auth.getallLocations);
  }
   //---------------------Charge Code----------------//
  addChargecode(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.chargecode, body);
  }
  getAllChargecode(pageNumber: number, pageSize: number) {
    const params = new HttpParams()
      .set('pageNo', pageNumber.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get<any>(url + settings.AppRoutes.Auth.chargecode, { params });
  }
  editChargecode(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.chargecode, body);
  }
   //---------------------Charge Code----------------//
   addProdcut(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.product, body);
  }
  getAllProdcut(){
    return this.http.get<any>(url + settings.AppRoutes.Auth.product);
  }
  editProduct(body: any){
    return this.http.put<any>(url + settings.AppRoutes.Auth.product, body);
  }
}
