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


saveAsDraftProject(status: number, body: any){
  const params = new HttpParams().set('status', status.toString());
  return this.http.post<any>(url + settings.AppRoutes.Auth.saveProjectDraft, body, { params });
}


}
