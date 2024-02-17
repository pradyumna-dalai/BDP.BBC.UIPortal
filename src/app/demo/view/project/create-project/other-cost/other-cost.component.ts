import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppMainComponent } from 'src/app/app.main.component';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { ChangeDetectorRef } from '@angular/core';
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
  tableData: any[] = [];
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
    this.tableData.push({
      costItem: '',
      location: null,
      totalCost: null,
      originDestination: '',
      editing: true, 
      adding: true 
    });
    this.cd.detectChanges();
  }
  
  

  onRowEditInit(rowIndex: number) {
    this.tableData.forEach((row, index) => {
      if (index === rowIndex) {
        row.editing = true;
      } else {
        row.editing = false; // ensure that only the selected row is set to editing mode
      }
    });
  }
  
  onRowEditSave(rowIndex: number): void {
    this.tableData[rowIndex].editing = false;
    delete this.tableData[rowIndex].adding;
  }
  
  onRowEditCancel() {
    this.editedRowIndex = -1;
  }
  
  onRowDelete(rowIndex: number): void {
    if (!this.tableData[rowIndex].adding) {
      this.tableData.splice(rowIndex, 1);
    }
  }
  
  saveProjectsOtherCostItem() {
    const body ={
        projectId:  this.projectId ,
        projectName: this.projectName,
        grandTotalCost: 927000.00,
        otherCosts: [
            {
                costItemId: null,
                costItemName:null ,
                locationId: null,
                locationName:null ,
                totalCost:null ,
                orginDestinationCode: null
            }
        ]
    };
    this.projectService.saveProjectOtherCost(body).subscribe({
      next: (response: any) => {
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Project Other Cost saved successfully.'
        });
      },
      error: (error) => {
          this.messageService.add({
            key: 'errorToast',
            severity: 'error',
            summary: 'Error!',
            detail: 'Failed to save Project Other Cost.'
          });
      }
    });
  }


}
