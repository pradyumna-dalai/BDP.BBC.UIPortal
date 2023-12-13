import { Component } from '@angular/core';
import { EventEmitter, OnInit, Output } from '@angular/core';
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
  startDate: Date;
  endDate: Date;
  selectedManagers: any[] = [];
  statusOptions: any[]
  projectSuggestions: any[]
  managerOptions: any[]
  opportunityManagers: any[];
  constructor(private filterService: FilterService) { }

  ngOnInit() {
    this.fetchProjectStatus();

  }

  searchProjects(query: string) {
    // Implement project search 
  }

  onSearchClick() {
    // Implement search logic 
  }

  onClearFilterClick() {
    // Implement logic to clear filters
  }
   fetchOpportunityManagers() {
    this.filterService.getOpportunityManager().subscribe(
      (response) => {
        console.log("op",response)
        this.opportunityManagers = response; 
      },
      (error) => {
        console.error('Error fetching opportunity managers', error);
      }
    );
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


}
