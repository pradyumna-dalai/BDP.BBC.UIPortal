import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppMainComponent } from 'src/app/app.main.component';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { ChangeDetectorRef } from '@angular/core';
interface CostItem {
  id: number;
  costItem: string;
  location: any; 
  totalCost: number;
  originDestination: string;
  editing: boolean; 
}
@Component({
  selector: 'app-other-cost',
  templateUrl: './other-cost.component.html',
  styleUrls: ['./other-cost.component.scss']
})

export class OtherCostComponent {
  projectLocations: any;
  projectId: any;
  projectName: any;
  subscription: any;
  locationDropdownOptions: any[] = [];
  tableData: CostItem[] = [];
  editedRowIndex: number = -1;
  constructor(private projectService: ProjectsService,  private cd: ChangeDetectorRef,private messageService: MessageService, private appMain: AppMainComponent, private createBuildingBlockservice: CreateBuildingBlockService) {
    
  }
  
  ngOnInit() {
    this.projectService.draftData$.subscribe(data => {
      this.projectLocations = data.data.projectLocation.filter(loc => loc.originDestinationCode === 0 || loc.originDestinationCode === 1);
      this.projectId = data.data.id;
      this.projectName = data.data.projectInformation.projectName;
      console.log('othercost', this.projectLocations);
      this.generateDropdownOptions();
});
  }
  

  generateDropdownOptions() {
    this.locationDropdownOptions = this.projectLocations.map(location => ({
      id: location.location.id,
      name: location.location.name,
      originDestinationCode: location.originDestinationCode
    }));

    console.log("locatoptions", this.locationDropdownOptions);
  }

  addRow() {
    const newCostItem: CostItem = {
      id: this.tableData.length + 1,
      costItem: '',
      location: null,
      totalCost: 0,
      originDestination: '',
      editing: true 
    };
    this.tableData.push(newCostItem);
  }



  onRowEditInit(row: number) {
    this.tableData[row].editing = true;
  }

  onRowEditSave(row: number) {
    this.tableData[row].editing = false;
  }

  onRowEditCancel(row: number) {
    this.tableData[row].editing = false;
  }

  updateOriginDestination(cost: CostItem) {
    const selectedLocation = this.locationDropdownOptions.find(option => option.id === cost.id);
    if (selectedLocation) {
      cost.originDestination = selectedLocation.originDestinationCode === 0 ? 'Origin' : 'Destination';
      cost.location = selectedLocation;
      
    }
  }
  
  onRowDelete(row: number) {
    this.tableData.splice(row, 1);
  }
  
  saveProjectsOtherCostItem() {
    const body = {
      projectId: null,
      projectName: this.projectName,
      grandTotalCost: 927000.00,
      otherCosts: this.tableData.map(costItem => ({
          costItemId: null,
          costItemName: costItem.costItem,
          locationId: costItem.location.id,
          locationName: costItem.location.name, 
          totalCost: costItem.totalCost,
          orginDestinationCode: costItem.location.originDestinationCode 
      }))
  };
    this.projectService.saveProjectOtherCost(body).subscribe({
      next: (response: any) => {
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Project Other Cost Saved successfully.'
        });
      },
      error: (error) => {
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Failed to Save Project Other Cost.'
          });
      }
    });
  }


}
