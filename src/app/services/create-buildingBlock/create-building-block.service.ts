import * as settings from "../../../app/common/lib/api-constants";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateBuildingBlockService {

  constructor(protected http: HttpClient) { }
  public createBuildingBlock(body) {
    // return this.http.get<any>(settings.AppRoutes.Auth.createBuildingBlock,body);
    //  return this.http.post<any>("http://localhost:5000/buildingblocks/api/v1/buildingblock", body);
    return this.http.post<any>(settings.AppRoutes.Auth.createBuildingBlock, body);
  }


  public getExplorerData() {
    return this.http.get<any>("http://localhost:5000/buildingblocks/api/v1/buildingblock?status=1");
    //return this.http.get<any>(settings.AppRoutes.Auth.getexploreViewBuildingBlock);

  }

}
