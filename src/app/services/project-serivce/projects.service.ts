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
  private draftDataSubject = new BehaviorSubject<any>(null);
  draftData$ = this.draftDataSubject.asObservable();

  constructor(protected http: HttpClient) { }


saveAsDraftProject(body: any){
  // const params = new HttpParams().set('status', status.toString());
  return this.http.post<any>(url + settings.AppRoutes.Auth.saveProjectDraft, body);
}

setDraftData(data: any) {
  this.draftDataSubject.next(data);
}


////////////////////////////------------------shared-----------------------------//

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
deleteProject(id:number) {
  const downloadUrl = `${url}${settings.AppRoutes.Auth.saveProjectDraft}/${id}`;
  return this.http.delete(downloadUrl);
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

getAllProjectArtifacts(scopeId: number, entityId: number): Observable<any> {
  return this.http.get<any>(`${url}${settings.AppRoutes.Auth.getAllFiles}?scopeId=${scopeId}&entityId=${entityId}&limitSize=3&removeDuplicate=false`);
}



//------------------------------get uploaded files------------------------//

/** get Project */ 
getProjectDetails(projId: number): Observable<any> {

  return this.http.get<any>(`${url}${settings.AppRoutes.Auth.saveProjectDraft}/${projId}`);

}
copyProject(body): Observable<any> {
  
   return this.http.post<any>(url +`project/` +settings.AppRoutes.Auth.copyProject, body);
  // return this.http.post<any>(`https://private-anon-fb6e707442-psabdpbbcapiblueprint.apiary-mock.com/version/project/copy`,body);

}

//--------------------Project BB----------------------------------//
getProcessStepByBlockId(blockId: number ){
  const blockIdStr = blockId.toString(); 
  return this.http.get<any>(`${url}${settings.AppRoutes.Auth.getProcessStepbyBlockId}?blockId=${blockIdStr}`);
}




//--------------------------end---------------------------------//



/** volume **/

getvolumeDetails(projId: number): Observable<any> {

  return this.http.get<any>(url +`project/`+ projId + `/` + settings.AppRoutes.Auth.getAddVoulmeDetails);

  

}

savevolumeDetails(body: any) {

  return this.http.post<any>(url + settings.AppRoutes.Auth.saveVoulmeDetails, body);

}

downloadAddVolumeExcel(projId: number) {

  return this.http.get(url +`project/`+ projId + `/` + settings.AppRoutes.Auth.exportAddVolume, { responseType: 'arraybuffer' as 'json' });
}

uploadAddVolumeExcel(formData: FormData,projId: number) {
  return this.http.post(url +`project/`+ projId + `/` + settings.AppRoutes.Auth.importAddVolume, formData).pipe(
    catchError((error: any) => {
      return throwError(error);
    })
  );
}

/** end */

/** cost line item **/

getCostLineItemDetails(projId: number): Observable<any> {

   return this.http.get<any>(url +`project/`+ projId + `/` + settings.AppRoutes.Auth.getCostLineItemDetails);

}

getCostLineItemDetailsReCalc(projId: number,body: any): Observable<any> {

  return this.http.post<any>(url +`project/`+ projId + `/` + settings.AppRoutes.Auth.reCalculateCostLine,body);

}

saveCostLineItemDetails(body: any) {

  return this.http.post<any>(url + settings.AppRoutes.Auth.saveCostLineItemDetails, body);

}

downloadCLIExcel(projId: number) {

  return this.http.get(url +`project/`+ projId + `/` + settings.AppRoutes.Auth.exportCLI, { responseType: 'arraybuffer' as 'json' });
}


uploadCLIExcel(formData: FormData,projId: number) {
  return this.http.post(url +`project/`+ projId + `/` + settings.AppRoutes.Auth.importCLI, formData).pipe(
    catchError((error: any) => {
      return throwError(error);
    })
  );
}


/** end */


//-------------------------------------------Project Building Block ------------------------------------------------------//
saveProjectBuildingBlock(body:any): Observable<any> {
  return this.http.post<any>(url + settings.AppRoutes.Auth.ProjectBuildingBlock, body);
}

getProjectBuildingBlocks(projectId:number){
  return this.http.get<any>(`${url}${settings.AppRoutes.Auth.ProjectBuildingBlock}/${projectId}`);
}

//-----------------------------------------------------end------------------------------------------------------------------//


//-----------------------------------------------Project Other Cost-----------------------//
saveProjectOtherCost(body:any): Observable<any> {
  return this.http.post<any>(url + settings.AppRoutes.Auth.otherCost, body);
}


getAllOtherCost(projectId:number){
  return this.http.get<any>(`${url}${settings.AppRoutes.Auth.project}/${projectId}/${settings.AppRoutes.Auth.otherCosts}`);
}


getAllOtherCostLocation(projectId:number){
  return this.http.get<any>(`${url}${settings.AppRoutes.Auth.project}/${projectId}/${settings.AppRoutes.Auth.getOtherCostLocation}`);
}

 //--------------------------------Sow-----------------------------------------//

 getSOWInformations(projectId:number){
  return this.http.get<any>(`${url}${settings.AppRoutes.Auth.getSowInformation}/${projectId}`);    
 }
  //----------------------------------Project Revenue tab-----------------//

  saveProjectRevenue(body:any): Observable<any> {
    return this.http.post<any>(url + settings.AppRoutes.Auth.Revenue, body);
  }
  
  
  getAllProjectRevenue(projectId:number){
    return this.http.get<any>(`${url}${settings.AppRoutes.Auth.project}/${projectId}/${settings.AppRoutes.Auth.Revenue}`);
  }
 

}

