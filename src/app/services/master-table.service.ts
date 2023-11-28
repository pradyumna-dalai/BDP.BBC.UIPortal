import * as settings from "../../app/common/lib/api-constants";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
var url = "/buildingblocks/api/v1/"

@Injectable({
  providedIn: 'root'
})
export class MasterTableService {

  constructor(protected http: HttpClient) { }

   // ********************master data: Product *********************//
   public getProductName() 
   {
    
    return this.http.get<any>(url+settings.AppRoutes.Auth.getProductName);
  }
  public getProductScope(body,id) 
  {
  
    return this.http.get<any>(url+id+`/`+settings.AppRoutes.Auth.getProductScope, body);
  }
  public getProductCategory(body,id) 
  {
    return this.http.get<any>(url+id+`/`+settings.AppRoutes.Auth.getProductCtegory, body);
  }
  public getChargeCode() {

    return this.http.get<any>(url+settings.AppRoutes.Auth.getchargeCode);
  }
  public getModeOfTransport() {

    return this.http.get<any>(url+settings.AppRoutes.Auth.getModeofTransport);
  }
}
