import * as settings from "../../app/common/lib/api-constants";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MasterTableService {

  constructor(protected http: HttpClient) { }

   // ********************master data: Product *********************//
   public getProductName(body) {
    return this.http.get<any>("http://localhost:8080/buildingblocks/api/v1/product", body);
    // var url = settings.AppRoutes.Auth.getProductName;
    // console.info('getProductName',url);
    // return this.http.get(`${settings.AppRoutes.Auth.getProductName}`,body);
  }
  public getProductScope(body,id) {
    return this.http.get<any>(`http://localhost:8080/buildingblocks/api/v1/${id}/scope`, body);
    // return this.http.get<any>(`${settings.AppRoutes.Auth.getProductScope}/${id}`, body);
  }
}
