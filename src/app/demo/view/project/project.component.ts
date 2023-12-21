import { Component } from '@angular/core';
import {AppBreadcrumbService} from '../../../app.breadcrumb.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import {  Router } from '@angular/router';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ProjectComponent {

  private sortBy: string = 'defaultColumnName';
  private sortDirection: string = 'asc';
  // datas: YourDataType[] = [];

  text:string = '';
  data: any = {};
  rowDisabledState: { [key: string]: boolean } = {};
  proejctdetails=[];
  constructor(private datePipe: DatePipe,private breadcrumbService: AppBreadcrumbService, 
    private confirmationService: ConfirmationService,private router: Router ,
    private http: HttpClient,private projectsService:ProjectsService) {
    this.breadcrumbService.setItems([
        {label: 'Project'}
    ]);
}
ngOnInit(){
  this.fetchData();

  this.fetchAllProjectDetails();
}
confirm(val: string, itemId: string) {
  if (val == 'copy'){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to copy this project?',
      accept: () => {
         this.router.navigateByUrl('/create-project');
      }
    });
  }
  if (val == 'delete'){
    this.confirmationService.confirm({
      message: 'Are you sure that you want delete this project?',
      accept: () => {
         this.rowDisabledState[itemId] = true;

      }
    });
  }
  
  }


  fetchAllProjectDetails() {
    this.projectsService.getAllProjectDetails().subscribe((res: any) => {
      if (res?.message == "success") {
        this.proejctdetails = res?.data.map((item: any) => {
          const opportunityManagers = item.projectInformation.opportunityManager?.map(manager => manager.name).join(', ');
          //console.log('opp',opportunityManagers);
          const formattedStartDate = this.datePipe.transform(item.projectInformation?.startDate, 'dd-MM-yyyy');
          const formattedEndDate = this.datePipe.transform(item.projectInformation?.endDate, 'dd-MM-yyyy');
      return {
            comp_name: item.name,
            proj_id: item.projectInformation?.customerCode,
            proj_name: item.projectInformation?.projectName,
            oppourtunity_name: item.projectInformation?.opportunityName?.name,
            proj_stage: item.projectInformation?.projectStage?.name,
            proj_status: item.status?.name,
            oppourtunity_manager: opportunityManagers,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          };
        });
        //console.log('fbggf', this.proejctdetails);
      } else {
        this.proejctdetails = [];
      }
    });
  }
  // onSort(columnVal: string){
    
  // if (columnVal == 'companyname'){
  //   this.projectsService.getSortingProjectDetails('companyname').subscribe(
  //     (res) => {
  //       console.log('Draft saved successfully:', res);


  //     },
  //     (error) => {
  //       console.error('Error saving draft:', error);

       
  //     }
  //   );
  // }
    

  // }

  // Method to fetch data with sorting parameters
  private fetchData(): void {
    const apiUrl = `http://bbc-dev-api.eba-wumjpfkg.us-east-1.elasticbeanstalk.com/buildingblocks/api/v1/project-sorting?sortBy=${this.sortBy}&sortDir=${this.sortDirection}`;
    
    this.http.get(apiUrl)
      .subscribe((response) => {
        var sortdata = response;
        console.log(sortdata);
      });
  }

  // Method to handle sorting when column header is clicked
  public onSort(columnName: string): void {
    // Toggle sort direction if the same column is clicked
    if (this.sortBy === columnName) {
      this.sortDirection = (this.sortDirection === 'asc') ? 'desc' : 'asc';
    } else {
      // Set a new column for sorting
      this.sortBy = columnName;
      this.sortDirection = 'asc'; // or 'desc' based on your default preference
    }

    // Fetch data with new sorting parameters
    this.fetchData();
  }

}
