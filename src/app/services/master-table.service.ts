import * as settings from "../../app/common/lib/api-constants";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class MasterTableService {

  constructor(protected http: HttpClient) { }

   // ********************master data: Product *********************//
   public getProductName() {
    // return this.http.get<any>("http://localhost:5000/buildingblocks/api/v1/product", body);
    // var url = settings.AppRoutes.Auth.getProductName;
    // console.info('getProductName',url);
  
    return this.http.get<any>(settings.AppRoutes.Auth.getProductName);
  }
  public getProductScope(body,id) {
    return this.http.get<any>(`http://bbc-dev-api.eba-wumjpfkg.us-east-1.elasticbeanstalk.com/buildingblocks/api/v1/${id}/scope`, body);
    // return this.http.get<any>(`${settings.AppRoutes.Auth.getProductScope}/${id}`, body);
  }
  public getProductCategory(body,id) {
    return this.http.get<any>(`http://bbc-dev-api.eba-wumjpfkg.us-east-1.elasticbeanstalk.com/buildingblocks/api/v1/${id}/category`, body);
    // return this.http.get<any>(`${settings.AppRoutes.Auth.getProductCtegory}/${id}`, body);
  }
  public getChargeCode() {

    return this.http.get<any>(settings.AppRoutes.Auth.getchargeCode);
  }
}
