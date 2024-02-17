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
  grandTotalCost: number = 0;
  constructor(private projectService: ProjectsService, private cd: ChangeDetectorRef, private messageService: MessageService, private appMain: AppMainComponent, private createBuildingBlockservice: CreateBuildingBlockService) {

  }

  ngOnInit() {
    this.projectService.draftData$.subscribe(data => {
      this.projectLocations = data.data.projectLocation.filter(loc => loc.originDestinationCode === 0 || loc.originDestinationCode === 1);
      this.projectId = data.data.id;
      this.projectName = data.data.projectInformation.projectName;
      // console.log('othercost', this.projectLocations);
      this.generateDropdownOptions();
      this.getAllProjectOtherCost();
    });

  }


  generateDropdownOptions() {
    this.locationDropdownOptions = this.projectLocations.map(location => ({
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
    this.tableData[row].editing = false;
    this.calculateGrandTotalCost();
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
    this.calculateGrandTotalCost();
  }

  //-----------------------------------Save Project Other Cost------------------//
  saveProjectsOtherCostItem() {
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


  //------------------------Get Project Other Cost------------------------------//

  getAllProjectOtherCost() {
    if (this.projectId != null) {
      this.projectService.getAllOtherCost(this.projectId).subscribe({
        next: (response: any) => {
          console.log('Other costs response:', response);
          const otherCosts = response?.data?.otherCosts;
          if (Array.isArray(otherCosts)) {
            this.tableData = otherCosts.map((item: any, index: number) => ({
              id: index + 1,
              costItem: item.costItemName,
              location: {
                id: item.locationId,
                name: item.locationName,
                originDestinationCode: item.orginDestinationCode
              },
              totalCost: item.totalCost,
              originDestination: item.orginDestinationCode === 0 ? 'Origin' : 'Destination',
              editing: false
            }));
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



}
