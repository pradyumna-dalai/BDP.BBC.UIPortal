import { Component, Input } from '@angular/core';
import { FilterService } from '../filter/filter.service';
import { MasterTableService } from 'src/app/services/master-table.service';
import dayjs, { Dayjs } from 'dayjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {
  sendData='kabir'
  sidebarVisible: boolean = false;
  showAdvancedSearch: boolean = false;
  selectedStage: any;
  selectedStatus: string;
  selectedProject: any;
  selectedManager: any;
  startDate: Date;
  endDate: Date;
  // filterResultValue:any;
  // selected:{startDate: Dayjs, endDate: Dayjs};
  selectedOpportunityManagers: any[] = [];
  statusOptions: any[]
  projectSuggestions: any[] = [];
  managerOptions: any[]
  opportunityManagers: any[];
  projectStageOptions: any[];
  isCompanySelected: boolean = false;
  isProjectStageSelected: boolean = false;
    //hiding info box
    visible:boolean = false;

    isapply:boolean = false;
    range = new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    });

    es: any;

    invalidDates: Array<Date>
    selected: {startDate: Date, endDate: Date};
    formatDate(date: Date): string {
      return dayjs(date).format('DD.MM.YY');
    }

/**@project forms */

projectName:any;
oppourtunity_name:any;
opportunity_manager:any;

  constructor(private datePipe: DatePipe,private filterService: FilterService, public MasterTableservice: MasterTableService, private projectService:ProjectsService) {

  }
  date = new Date();
  control = new FormControl(
    {
      from: this.date,
      to: new Date(this.date.getTime() + 1 * 24 * 60 * 60 * 1000),
    },
    Validators.required
  );
  ngOnInit() {
    // this.fetchProjectStatus();
    this.fetchOpportunityManagers();
    this.fetchProjectbyCompany();
    this.fetchProjectStage();

  }

  getOpportunityManagerId(event:any){
    console.log(event)
  }









  searchProjects(query: string) {
    // Implement project search 
  }

  onSearchClick() {
    // Implement search logic 
  }
  onclickShow()
  {
    this.visible = !this.visible
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
    this.projectStageOptions = null;
    // this.fetchProjectStatus();
    this.fetchProjectStage();
    this.fetchOpportunityManagers();
    this.fetchProjectbyCompany();
    this.OnStageSelectProjectstatus(event);
    this.fetchOpprNameOnCompanySelect(event);
    this.isapply = false;
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
        this.managerId = res?.data.map((manager: any) => manager.id);
      } else {
        this.opportunityManagers = [];
      }
    })
  }
managerId:any;
  fecthOppManager(){
    let managerId = this.opportunityManagers.map((ele) => ele.value);
    console.log("id",managerId)
  }

  getProjectFilter(){
  //   let payload= {
  //     "status": {
  //         "id": this.selectedStatus
  //     },
  //     "projectName": null,
  //     "opportunityName": {
  //         "id": this.oppourtunity_name
  //     },
  //     "opportunityManager": {
  //         "id": this.opportunity_manager
  //     },
  //     "startDate":this.formatDate(this.selected.startDate),
  //     "endDate":this.formatDate(this.selected.endDate),
  // }
  let payload={
    "status": {
    "id": 2
    }
    // "projectName": "BBC",
    // "opportunityName": {
    //     "id": 1
    // },
    // "opportunityManager": {
    //     "id": 1
    // },
    // "startDate":"2023-12-15",
    // "endDate":"2023-12-20"
}
  console.log("payload",payload)
  this.projectService.advanceSearchFilter(payload).subscribe(
    (response) => {
      console.log('Response:', response);
    },
    (error) => {
      console.error('Error:', error);
    }
  );
    this.visible = false;
    this.isapply = true;
    this.projectService.updateData(this.sendData);
  }

}
