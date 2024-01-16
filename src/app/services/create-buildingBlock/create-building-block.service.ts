import * as settings from "../../../app/common/lib/api-constants";
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

var url = "/buildingblocks/api/v1/"
@Injectable({
  providedIn: 'root'
})
export class CreateBuildingBlockService {

  constructor(protected http: HttpClient) { }
  public saveEditBuildingBlocks(status: number, body: any) {
    const params = new HttpParams().set('status', status.toString());
    return this.http.post<any>(url + settings.AppRoutes.Auth.saveEditBuildingBlock, body, { params });
  }

  public getExplorerData(status: number): Observable<any> {
    const params = new HttpParams().set('status', status.toString());

    return this.http.get<any>(`${url}${settings.AppRoutes.Auth.getexploreViewBuildingBlock}`, { params });
  }


  getBuildingBlockDetails(blockId: number): Observable<any> {

    return this.http.get<any>(`${url}${settings.AppRoutes.Auth.getbuildingBlockDetailsView}/${blockId}`);

  }
  
  scopingCradImportExcel(formData: FormData) {
    return this.http.post(url+settings.AppRoutes.Auth.scopingCradImportExcel, formData).pipe(
      catchError((error: any) => {
        return throwError(error); // Pass the error to the subscriber
      })
    );
  }

  commercialCradImportExcel(formData: FormData) {
    return this.http.post(url+settings.AppRoutes.Auth.commercialCradImportExcel, formData).pipe(
      catchError((error: any) => {
        return throwError(error); // Pass the error to the subscriber
      })
    );
  }
  downloadSamplescExcel()
  {
   
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadSampleSCExcel}`, { responseType: 'arraybuffer' as 'json' });
  }
  downloadSampleCCExcel()
  {
   
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadSampleCCExcel}`, { responseType: 'arraybuffer' as 'json' });
  }
  downloadSampleOPExcel()
  {
   
    return this.http.get(`${url}${settings.AppRoutes.Auth.downloadSampleOPExcel}`, { responseType: 'arraybuffer' as 'json' });
  }



}