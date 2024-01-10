import { HttpClient } from '@angular/common/http';
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
  
  deleteLocationDetails(locationId: number){
    const payload = { id: locationId, isDeleted: true };
    return this.http.delete<any>(url + settings.AppRoutes.Auth.deleteLocations,{ body: payload });
  }

  addLocations(body: any){
    return this.http.post<any>(url + settings.AppRoutes.Auth.addLocations,body);
  }

}
