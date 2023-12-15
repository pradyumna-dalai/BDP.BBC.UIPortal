import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import * as settings from "../../../app/common/lib/api-constants";
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";
var url = "/buildingblocks/api/v1/"
@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(protected http: HttpClient) { }
  private filterCriteria: any = {};

  getFilterCriteria(): any {
    return this.filterCriteria;
  }

  setFilterCriteria(criteria: any): void {
    this.filterCriteria = criteria;
  }

  getprojectStatus() {
    return this.http.get<any>(url+settings.AppRoutes.Auth.getprojectStatus);
  }

  getOpportunityManager() {
    return this.http.get<any>(url+settings.AppRoutes.Auth.getopportunityManager);
  }

  getAllProjectByCompany(){
    return this.http.get<any>(url+settings.AppRoutes.Auth.getallProject);
  }

  getOpportunityNameByCompany(companyId:number){
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<any>(url+settings.AppRoutes.Auth.getOpportuniyByCompany,{params});
  }
}
