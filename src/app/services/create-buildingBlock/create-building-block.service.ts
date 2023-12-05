import * as settings from "../../../app/common/lib/api-constants";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
var url = "/buildingblocks/api/v1/"
@Injectable({
  providedIn: 'root'
})
export class CreateBuildingBlockService {

  constructor(protected http: HttpClient) { }
  public createBuildingBlock(body) {
    // return this.http.get<any>(settings.AppRoutes.Auth.createBuildingBlock,body);
    //  return this.http.post<any>("http://localhost:5000/buildingblocks/api/v1/buildingblock", body);
    return this.http.post<any>(url + settings.AppRoutes.Auth.createBuildingBlock, body);
  }


  public getExplorerData(status: number): Observable<any> {
    const params = new HttpParams().set('status', status.toString());

    return this.http.get<any>(`${url}${settings.AppRoutes.Auth.getexploreViewBuildingBlock}`, { params });
  }


  getBuildingBlockDetails(blockId: BigInteger): Observable<any> {

    return this.http.get<any>(`${url}${settings.AppRoutes.Auth.getbuildingBlockDetailsView}/${blockId}`);

  }

}