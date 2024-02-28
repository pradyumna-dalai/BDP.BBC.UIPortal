import { Component,Output, EventEmitter,Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppMainComponent } from 'src/app/app.main.component';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { ChangeDetectorRef } from '@angular/core';
import { SharedServiceService } from 'src/app/services/project-serivce/shared-service.service';
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
  grandTotalCost: number = 0;
  @Output() continueClickedToProjectCost: EventEmitter<any> = new EventEmitter();
  @Input() projStatus: any | null;
  @Input() projectIdCLI: number | null;
  constructor(private sharedService: SharedServiceService,private projectService: ProjectsService, private cd: ChangeDetectorRef, private messageService: MessageService, private appMain: AppMainComponent, private createBuildingBlockservice: CreateBuildingBlockService) {

  }

  ngOnInit() {
    this.projectService.draftData$.subscribe(data => {
      this.projectLocations = data?.data?.projectLocation.filter(loc => loc.originDestinationCode === 0 || loc.originDestinationCode === 1);
      this.projectId = data?.data?.id;
      this.projectName = data?.data?.projectInformation.projectName;
      // console.log('othercost', this.projectLocations);
      this.generateDropdownOptions();
      this.getAllProjectOtherCost();
      
    });
    if(this.projectIdCLI != null || this.projectIdCLI != undefined)
    {
      this.getAllProjectOtherCostEdit(this.projectIdCLI);
    }
    this.projStatus = this.projStatus;

  }
  onClickContinue() {
    // Emit event to notify parent component to move to next tab
    this.continueClickedToProjectCost.emit();
}


  generateDropdownOptions() {
    this.locationDropdownOptions = this.projectLocations?.map(location => ({
      id: location.location.id,
      name: location.location.name,
      originDestinationCode: location.originDestinationCode
    }));

    //console.log("locatoptions", this.locationDropdownOptions);
  }

  calculateGrandTotalCost() {
    this.grandTotalCost = this.tableData.reduce((total, item) => total + item.totalCost, 0);
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
    this.calculateGrandTotalCost();
  }



  onRowEditInit(row: number) {
    this.tableData[row].editing = true;
    this.calculateGrandTotalCost();
  }

  onRowEditSave(row: number) {
    const editedItem = this.tableData[row];
    if (!editedItem.costItem || !editedItem.location || editedItem.totalCost === null || editedItem.totalCost === undefined) {
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Please fill all required fields before saving.'
      });
      return; // Stop further execution
    }
    this.tableData[row].editing = false;
    this.calculateGrandTotalCost();
  }

  onRowEditCancel(row: number) {
    this.tableData.splice(row, 1);
  }

  updateOriginDestination(cost: CostItem) {
    const selectedLocation = this.locationDropdownOptions.find(option => option.id === cost.id);
    if (selectedLocation) {
      cost.originDestination = selectedLocation.originDestinationCode === 0 ? 'Origin' : 'Destination';
      cost.location = selectedLocation;
    //  cost.editing = false;

    }
  }

  getOriginDestination(cost: CostItem): string {
    return cost.location?.originDestinationCode === 0 ? 'Origin' : 'Destination';
  }
  onRowDelete(row: number) {
    this.tableData.splice(row, 1);
    this.calculateGrandTotalCost();
  }

  //-----------------------------------Save Project Other Cost------------------//
  saveProjectsOtherCostItem() {
    const invalidItem = this.tableData.find(item => !item.costItem || !item.location || item.totalCost === null || item.totalCost === undefined);
  if (invalidItem) {
    this.messageService.add({
      key: 'errorToast', 
      severity: 'error',
      summary: 'Error!',
      detail: 'Please fill all required fields before saving.'
    });
    return; // Stop further execution
  }

    this.calculateGrandTotalCost();
    const body = {
      projectId: this.projectId,
      projectName: this.projectName,
      grandTotalCost: 927000.00,
      otherCosts: this.tableData.map(costItem => ({
        costItemId: null,
        costItemName: costItem.costItem,
        locationId: costItem.location.id,
        locationName: costItem.location.name,
        totalCost: costItem.totalCost,
        originDestinationCode: costItem.location.originDestinationCode
      }))
    };
    this.projectService.saveProjectOtherCost(body).subscribe({
      next: (response: any) => {
        this.sharedService.setProjectIdOtherCost(response?.data?.projectId);
        this.sharedService.setDraftSavedOtherCost(true);
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


  //------------------------Get Project Other Cost------------------------------//

  getAllProjectOtherCost() {
    if (this.projectId != null) {
      this.projectService.getAllOtherCost(this.projectId).subscribe({
        next: (response: any) => {
         // console.log('Other costs response:', response);
          const otherCosts = response?.data?.otherCosts;
          if (Array.isArray(otherCosts)) {
            this.tableData = otherCosts.map((item: any, index: number) => ({
              id: index + 1,
              costItem: item.costItemName,
              location: {
                id: item.locationId,
                name: item.locationName,
                originDestinationCode: item.originDestinationCode
              },
              totalCost: item.totalCost,
              originDestination: item.originDestinationCode === 0 ? 'Origin' : 'Destination',
              editing: false
            }));
            this.calculateGrandTotalCost();
          } else {
            console.error('Other costs array not found in response:', response);
          }
        },
        error: (error) => {
          console.error('Error fetching other costs:', error);
          // this.messageService.add({
          //   key: 'errorToast',
          //   severity: 'error',
          //   summary: 'Error!',
          //   detail: 'Failed to fetch Project Other Cost.'
          // });
        }
      });
    }
  }
  getAllProjectOtherCostEdit(projId){
      this.projectService.getAllOtherCost(projId).subscribe({
        next: (response: any) => {
         // console.log('Other costs response:', response);
          const otherCosts = response?.data?.otherCosts;
          if (Array.isArray(otherCosts)) {
            this.tableData = otherCosts.map((item: any, index: number) => ({
              id: index + 1,
              costItem: item.costItemName,
              location: {
                id: item.locationId,
                name: item.locationName,
                originDestinationCode: item.originDestinationCode
              },
              totalCost: item.totalCost,
              originDestination: item.originDestinationCode === 0 ? 'Origin' : 'Destination',
              editing: false
            }));
            this.calculateGrandTotalCost();
          } else {
      //      console.error('Other costs array not found in response:', response);
          }
        },
        error: (error) => {
          console.error('Error fetching other costs:', error);
          // this.messageService.add({
          //   key: 'errorToast',
          //   severity: 'error',
          //   summary: 'Error!',
          //   detail: 'Failed to fetch Project Other Cost.'
          // });
        }
      });
    
  }



}
