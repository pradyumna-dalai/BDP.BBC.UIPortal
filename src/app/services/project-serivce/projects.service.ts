import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as settings from "../../../app/common/lib/api-constants";
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

var url = "/buildingblocks/api/v1/"


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(protected http: HttpClient) { }


saveAsDraftProject(body: any){
  // const params = new HttpParams().set('status', status.toString());
  return this.http.post<any>(url + settings.AppRoutes.Auth.saveProjectDraft, body);
}

getAllProjectDetails(){
  return this.http.get<any>(url + settings.AppRoutes.Auth.getallProjects);
}

public getExplorerData(status: number): Observable<any> {
  const params = new HttpParams().set('status', status.toString());

  return this.http.get<any>(`${url}${settings.AppRoutes.Auth.getexploreViewBuildingBlock}`, { params });
}

getSortingProjectDetails(colName: string): Observable<any>{
  var sortDirection: string = 'asc';
  const params = new HttpParams().set('colName', colName.toString());
  return this.http.get<any>(`${url}${settings.AppRoutes.Auth.getSortingData}`, { params });
}


}
