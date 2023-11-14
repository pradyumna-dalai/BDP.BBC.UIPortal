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
    return this.http.get<any>('localhost:8080/buildingblocks/api/v1/product', body);
}
}
