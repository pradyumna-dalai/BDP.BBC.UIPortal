import { Component } from '@angular/core';
import { FilterService } from '../filter/filter.service';
import { MasterTableService } from 'src/app/services/master-table.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import dayjs from 'dayjs';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {
  sidebarVisible: boolean = false;
  showAdvancedSearch: boolean = false;
  selectedStage: any;
  selectedStatus: string;
  selectedProject: any;
  selectedManager: any;
  startDate: Date;
  endDate: Date;
  selectedOpportunityManagers: any[] = [];
  statusOptions: any[]
  projectSuggestions: any[] = [];
  managerOptions: any[]
  projectName:any[];
  project_name:any;
  opportunityManagers: any[];
  projectStageOptions: any[];
  isCompanySelected: boolean = false;
  isProjectStageSelected: boolean = false;
  visible: boolean = false;
  isapply: boolean = false;
  newSearchfilter: []
  constructor(private filterService: FilterService, public MasterTableservice: MasterTableService,
    private projectService: ProjectsService ,private messageService: MessageService,) {

  }

  ngOnInit() {
    // this.fetchProjectStatus();
    this.fetchOpportunityManagers();
    this.fetchProjectbyCompany();
    this.fetchProjectStage();
    this.fetchProjectName()
  }

  searchProjects(query: string) {
    // Implement project search 
  }

  onSearchClick() {
    // Implement search logic 
  }
  formatDate(date: Date): string {
    return dayjs(date).format('YYYY-MM-DD');
  }

  onClearFilterClick() {
    console.log("Clearing filters...");
    this.statusOptions = null;
    this.projectSuggestions = null;
    this.managerOptions = null;
    this.opportunityManagers = null;
    console.log("Filters cleared.");
    this.projectStageOptions = null;
    this.opportunity_manager = '';
    // this.fetchProjectStatus();
    this.fetchProjectStage();
    this.fetchOpportunityManagers();
    this.fetchProjectbyCompany();
    this.OnStageSelectProjectstatus(event);
    this.fetchOpprNameOnCompanySelect(event);
    this.selected = null;
    this.newSearchfilter = null;
    this.isapply = false;
    this.projectService.updateData([]);
  }


  fetchProjectStage() {
    this.projectStageOptions = [];
    this.MasterTableservice.getProjectStage().subscribe((res: any) => {
      if (res?.message == "success") {
        this.projectStageOptions = res?.data;
      } else {
        this.projectStageOptions = [];
      }
    })
  }
  // ---------------get project status------------------------//
  OnStageSelectProjectstatus(event) {
    // this.projectStatusOptions = [];
    const selectedStageId = event.value;
    this.isProjectStageSelected = !!selectedStageId;
    this.MasterTableservice.getProjectStatus(selectedStageId).subscribe((res: any) => {
      if (res?.message == "success") {
        this.statusOptions = res?.data;
      } else {
        this.statusOptions = [];
      }
    })
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

  fetchProjectName(){
    this.filterService.getProjectDropdown().subscribe((res)=>{
      console.log("ProjectDropdown",res);
      if (res?.message === "success") {
        this.projectName = res?.data.map((project: any) => ({
          label: project.projectName,
          id: project.id,
        }));
      } else {
        this.projectName = [];
      }
    })
  }

  managerId: any;
  fecthOppManager() {
    let managerId = this.opportunityManagers.map((ele) => ele.value);
    console.log("id", managerId)
  }
  oppourtunity_name: any;
  opportunity_manager: any;
  selected: { startDate: Date, endDate: Date };
  getProjectFilter() {
    let payload = {
      "status": {
        "id": this.selectedStatus
      },
      "projectName": this.project_name,
      "projectStage": {
        "id": this.selectedStage
      },
      "company": {
        "id": this.selectedProject
      },
      "opportunityName": {
        "id": this.selectedProject
      },
      "opportunityManager": {
        "id": this.opportunity_manager
      },
      "startDate": this.formatDate(this.selected.startDate),
      "endDate": this.formatDate(this.selected.endDate),
    }
    if (payload.status.id === 'Invalid Date') {
      payload.status = null;
    }
    if (payload.opportunityName.id === undefined) {
      payload.opportunityName = null;
    }
    if (payload.opportunityManager.id === undefined || payload.opportunityManager.id === '') {
      payload.opportunityManager = null;
    }

    if (payload.startDate === 'Invalid Date') {
      payload.startDate = null;
    }
    if (payload.endDate === 'Invalid Date') {
      payload.endDate = null;
    }
    if (payload.projectName === undefined ||  payload.projectName === '') {
      payload.projectName = null;
    }
    console.log("payload", payload)
    this.projectService.advanceSearchFilter(payload).subscribe(
      (response) => {
        
        this.newSearchfilter = response
        this.projectService.updateData(this.newSearchfilter);
        if(response.length >0){
          this.messageService.add({
            key: 'successToast',
            severity: 'success',
            summary: 'Success!',
            detail: 'Filter Data'
          });
        }else{
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'No Data' 
          });
        }
      },
      (error) => {
        console.error('Error:', error);
       
      }
    );
    this.visible = false;
    this.isapply = true;

  }
  isClicked = false;

  onclickShow() {
    this.visible = !this.visible;
    this.selected = null;
  }
  focusFunction(){
    this.isClicked = true;
  }
}
