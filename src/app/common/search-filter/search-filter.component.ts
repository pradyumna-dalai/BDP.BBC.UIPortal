import { Component } from '@angular/core';
import { FilterService } from '../filter/filter.service';
import { MasterTableService } from 'src/app/services/master-table.service';


@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {
  sidebarVisible: boolean = false;
  showAdvancedSearch: boolean = false;
  selectedStatus: string;
  projectName: string;
  selectedProject: any;
  selectedManager: any;
  startDate: Date;
  endDate: Date;
  selectedOpportunityManagers: any[] = [];
  statusOptions: any[]
  projectSuggestions: any[] = [];
  managerOptions: any[]
  opportunityManagers: any[];
  isCompanySelected: boolean = false;
  constructor(private filterService: FilterService, public MasterTableservice: MasterTableService) {

  }

  ngOnInit() {
    this.fetchProjectStatus();
    this.fetchOpportunityManagers();
    this.fetchProjectbyCompany();
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
    this.fetchOpportunityManagers();
    this.fetchProjectbyCompany();
  }

  fetchProjectStatus() {
    this.selectedStatus = '';
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

  fetchProjectbyCompany() {
    this.projectSuggestions = [];
    this.MasterTableservice.getCompany().subscribe((res: any) => {
      if (res?.message == "success") {
        this.projectSuggestions = res?.data;
      } else {
        this.projectSuggestions = [];
      }
    })

  }

  fetchOpprNameOnCompanySelect(event) {
    this.managerOptions = [];
    const selectedCompanyId = event.value;
    this.isCompanySelected = !!selectedCompanyId;
    this.MasterTableservice.getOpportunityName(selectedCompanyId).subscribe((res: any) => {
      if (res?.message === "success") {
        this.managerOptions = res?.data;
      } else {
        this.managerOptions = [];
      }
    });
  }

  fetchOpportunityManagers() {
    this.selectedOpportunityManagers = [];
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

  applyFilter(){
    // const body ={
      
    //     "status": {
    //         "id": this.selectedStatus
    //     }
    //     ,
    //     "projectName": this.projectName,
    //     "opportunityName": {
    //         "id": this.selectedManager
    //     }
    
    // }
    const body = 
      {
        "status": {
            "id": 1
        }
        ,
        "projectName": "BBC",
        "opportunityName": {
            "id": 1
        }
    }
    
    console.log(body)
    this.filterService.getFiltersSearchData(body).subscribe((res: any) => {
      if (res?.message === "success") {
     
      } else {
     
      }
    })
  }

}
