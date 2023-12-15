import { Component } from '@angular/core';
import { FilterService } from '../filter/filter.service';


@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {
  sidebarVisible: boolean = false;
  showAdvancedSearch: boolean = false;
  selectedStatus: string;
  selectedProject: any;
  selectedManager: any;
  startDate: Date;
  endDate: Date;
  selectedOpportunityManagers: any[] = [];
  statusOptions: any[]
  projectSuggestions: any[]
  managerOptions: any[]
  opportunityManagers: any[];
  opportunity_name: any;
  constructor(private filterService: FilterService) {
    this.fetchProjectStatus();
    this.fetchAllCompanyProjects();
    this.fetchOpportunityManagers();
    this.fetchOportunityNameByCompany();
    
   }

  ngOnInit() {

  }

  searchProjects(query: string) {
    // Implement project search 
  }

  onSearchClick() {
    // Implement search logic 
  }

  onClearFilterClick() {
    console.log("Clearing filters...");
  this.statusOptions = null;
  this.projectSuggestions = null;
  this.startDate = null;
  this.endDate = null;
  this.managerOptions = null;
  this.opportunityManagers = null;
  console.log("Filters cleared.");
  this.fetchProjectStatus();
  this.fetchAllCompanyProjects();
  this.fetchOpportunityManagers();
  this.fetchOportunityNameByCompany();
  }

  fetchProjectStatus() {
    this.filterService.getprojectStatus().subscribe((res: any) => {
      if (res?.message === "success") {
        this.statusOptions = res?.data.map((status: any) => ({
          label: status.name,
          value: status.id,
        }));
      } else {
        this.statusOptions = [];
      }
    });
  }

  // fetchOportunityNameByCompany(companyId: number) {
  //   this.managerOptions = [];
  //   this.filterService.getOpportunityNameByCompany(companyId).subscribe((res: any) => {
  //     if (res?.message == "success") {
  //       this.managerOptions = res?.data;
  //     } else {
  //       this.managerOptions = [];
  //     }

  //   })
  // }
  fetchAllCompanyProjects() {
    this.filterService.getAllProjectByCompany().subscribe((res: any) => {
      if (res?.message === "success") {
        this.projectSuggestions = res?.data.map((project: any) => ({
          label: project.name,
          value: project.id,
          companyId: project.companyId,
        }));
      } else {
        this.projectSuggestions = [];
      }
    });
  }

  fetchOportunityNameByCompany() {
    this.managerOptions = [];

    if (!this.selectedProject) {
      return;
    }
    const companyId = this.selectedProject.companyId;

    this.filterService.getOpportunityNameByCompany(companyId).subscribe((res: any) => {
      console.log("Opportunity Names Response:", res);
      if (res?.message == "success") {
        this.managerOptions = res?.data;
      } else {
        this.managerOptions = [];
      }
    });
  }


  fetchOpportunityManagers() {
    this.filterService.getOpportunityManager().subscribe((res: any) => {
      if (res?.message === "success") {
        this.opportunityManagers = res?.data.map((manager: any) => ({
          label: manager.name,
          value: manager.id,
        }));
      } else {
        this.opportunityManagers = [];
      }
    })
  }

}
