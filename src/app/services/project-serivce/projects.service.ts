import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as settings from "../../../app/common/lib/api-constants";
import { HttpClient, HttpContext, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";

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

downloadProjectData(startDate: string, endDate: string): Observable<HttpResponse<Blob>> {
  const params = {
    startDate: startDate,
    endDate: endDate,
  };
  
  const options = {
    params: params,
    observe: 'response' as const,
    responseType: 'blob' as 'json'
  };

  return this.http.get<Blob>(url + settings.AppRoutes.Auth.exportProjectsinExcel, options);
}
}
