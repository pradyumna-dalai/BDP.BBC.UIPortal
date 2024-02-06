import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as settings from "../../../app/common/lib/api-constants";
import { HttpClient, HttpContext, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
// import {Http, Headers} from '@angular/http';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


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

private buildingDataSubject = new BehaviorSubject<any>('');
  buildingData$ = this.buildingDataSubject.asObservable();

  shareBuildingData(newData: string) {
    this.dataSubject.next(newData);
  }

getAllProjectDetails(params: any): Observable<any>{
  let httpParams = new HttpParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      httpParams = httpParams.append(key, params[key]);
    }
  });
  return this.http.get<any>(url + settings.AppRoutes.Auth.getallProjects,{ params: httpParams});
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




private dataSubject = new BehaviorSubject<any>(''); 
public data$ = this.dataSubject.asObservable();

updateData(newData: any) {
  this.dataSubject.next(newData);
}


advanceSearchFilter(body: any): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YourAccessToken',
  });

  const options = {
    headers: headers,
  };

  // Use http.post instead of http.get for a POST request
  return this.http.post<any>(url + settings.AppRoutes.Auth.searchProject, body, options);
}

 //------process configurable-----------------------//

processConfigImportExcel(formData: FormData) {
  return this.http.post(url+settings.AppRoutes.Auth.uploadConfigurable, formData).pipe(
    catchError((error: any) => {
      return throwError(error); // Pass the error to the subscriber
    })
  );
}
processConfigGetImportExcelData() {
  return this.http.get(url+settings.AppRoutes.Auth.processConfigurable).pipe(
    catchError((error: any) => {
      return throwError(error); // Pass the error to the subscriber
    })
  );
}



//--------------------------Common Upload----------------------------//
UploadProjectArtifact(file: File, scopeId: number, entityId: number): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('file', file, file.name);

  const params = new HttpParams()
    .set('scopeId', scopeId.toString())
    .set('entityId', entityId.toString());

  return this.http.post(url+settings.AppRoutes.Auth.CommonUpload, formData,  { params }).pipe(
    catchError((error: any) => {
      return throwError(error);
    })
  );
}

deleteProjectDocument(id:number ) {
  const downloadUrl = `${url}${settings.AppRoutes.Auth.deleteProjectFile}/${id}`;
  return this.http.delete(downloadUrl);
}

}

