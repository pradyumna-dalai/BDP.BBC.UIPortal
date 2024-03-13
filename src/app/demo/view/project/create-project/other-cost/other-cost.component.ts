import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AppMainComponent } from 'src/app/app.main.component';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { ChangeDetectorRef } from '@angular/core';
import { SharedServiceService } from 'src/app/services/project-serivce/shared-service.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { NavigationStart, Router } from '@angular/router';
interface CostItem {
  id: number;
  costItem: {
    costItemId: null,
    name: ''
  }
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
  costItemDropdownOptions: any[] = [];
  tableData: CostItem[] = [];
  editedRowIndex: number = -1;
  grandTotalCost: number = 0;
  @Output() continueClickedToProjectCost: EventEmitter<any> = new EventEmitter();
  @Input() projStatus: any | null;
  @Input() projectIdCLI: number | null;
  constructor(private router: Router, private sharedService: SharedServiceService, private projectService: ProjectsService, private cd: ChangeDetectorRef, private masterDataSerivce: MasterDataService, private messageService: MessageService, private appMain: AppMainComponent, private createBuildingBlockservice: CreateBuildingBlockService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Set setDraftSavedOtherCost to false when navigating away
        this.sharedService.setDraftSavedOtherCost(false);
      }
    });
  }

  ngOnInit() {

    this.getAllProjectOtherCost();
    this.getAllCostItem();
    if (this.projectIdCLI != null || this.projectIdCLI != undefined) {
      this.getAllProjectOtherCostEdit(this.projectIdCLI);
      this.getAllOtherCostLocations(this.projectIdCLI);
    }
    this.projStatus = this.projStatus;
  }
  onClickContinue() {
    // Emit event to notify parent component to move to next tab
    this.continueClickedToProjectCost.emit();
  }

  calculateGrandTotalCost() {
    this.grandTotalCost = this.tableData.reduce((total, item) => total + item.totalCost, 0);
  }

  addRow() {
    const newCostItem: CostItem = {
      id: this.tableData.length + 1,
      costItem: {
        costItemId: null,
        name: ''
      },
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
    if (!editedItem.costItem || editedItem.totalCost === null || editedItem.totalCost === undefined) {
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Please fill all required fields before saving.'
      });
      return;
    }
    const selectedCostItem = this.costItemDropdownOptions.find(option => option.id === editedItem.costItem.costItemId);
    if (selectedCostItem) {
      editedItem.costItem.name = selectedCostItem.name;
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
      if (selectedLocation.originDestinationCode === 2) {
        cost.originDestination = 'Orign/Destination';
      } else {
        cost.originDestination = selectedLocation.originDestinationCode === 0 ? 'Origin' : 'Destination';
      }
      cost.location = selectedLocation;
    }
  }


  getOriginDestination(cost: CostItem): string {
    if (cost.location && cost.location.originDestinationCode !== undefined) {
      const originDestinationCode = cost.location.originDestinationCode;
      if (originDestinationCode === 0) {
        return 'Origin';
      } else if (originDestinationCode === 1) {
        return 'Destination';
      } else if (originDestinationCode === 2) {
        return 'Orign/Destination';
      }
    }
    return '';
  }


  onRowDelete(row: number) {
    this.tableData.splice(row, 1);
    this.calculateGrandTotalCost();
  }

  //-----------------------------------Save Project Other Cost------------------//
  saveProjectsOtherCostItem() {
    const invalidItem = this.tableData.find(item => !item.costItem || item.totalCost === null || item.totalCost === undefined);
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
      projectId: this.projectIdCLI,
      projectName: this.projectName,
      grandTotalCost: 927000.00,
      otherCosts: this.tableData.map(costItem => ({
        id: null,
        costItem: {
          id: costItem.costItem.costItemId,
          name: costItem.costItem.name
        },
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
              costItem: {
                costItemId: item.id,
                name: item.name
              },
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
  getAllProjectOtherCostEdit(projId) {
    this.projectService.getAllOtherCost(projId).subscribe({
      next: (response: any) => {
        // console.log('Other costs response:', response);
        const otherCosts = response?.data?.otherCosts;
        if (Array.isArray(otherCosts)) {
          this.tableData = otherCosts.map((item: any, index: number) => ({
            id: index + 1,
            costItem: {
              costItemId: item.id,
              name: item.name
            },
            //  costItemId:item.costItemId,
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

  //------------------------get all cost Item from Master Data-------------------//

  getAllCostItem() {
    this.costItemDropdownOptions = [];
    this.masterDataSerivce.getAllCostItemDetails().subscribe((res: any) => {
      if (res?.message == "success") {
        this.costItemDropdownOptions = res?.data.map((cost: any) => ({
          id: cost.id,
          name: cost.name
        }));
      } else {
        this.costItemDropdownOptions = [];
      }
    })
  }

  //--------------------get all  other cost location -----------------------------//
  getAllOtherCostLocations(projId) {
    this.projectService.getAllOtherCostLocation(projId).subscribe({
      next: (response: any) => {
        if (response?.message == "success") {
          this.locationDropdownOptions = response.data?.map(location => ({
            id: location.locationId,
            name: location.locationName,
            originDestinationCode: location.originDestinationCode
          }));
        } else {
          this.locationDropdownOptions = [];
        }
        console.log('loc', this.locationDropdownOptions);
      }
    });
  }

}
