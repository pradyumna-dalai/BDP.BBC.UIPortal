import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as settings from "../../../app/common/lib/api-constants";
import { HttpClient, HttpContext, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';
// import {Http, Headers} from '@angular/http';


var url = "/buildingblocks/api/v1/"


@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(protected http: HttpClient) { }
  private dataSubject = new BehaviorSubject<any>(''); 
  public data$ = this.dataSubject.asObservable();
  updateData(newData: any) {
    this.dataSubject.next(newData);
  }
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

advanceSearchFilter(body: any) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YourAccessToken',
  });

  // Assuming 'params' is an object representing the search parameters
  const options = {
    headers: headers,
  };

  return this.http.get<any>('http://ec2-34-205-39-55.compute-1.amazonaws.com/buildingblocks/api/v1/project-search',body);
}

}
