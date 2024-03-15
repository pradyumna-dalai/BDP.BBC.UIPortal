import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppMainComponent } from 'src/app/app.main.component';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { MasterDataService } from 'src/app/services/master-dataserivce/master-data.service';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { SharedServiceService } from 'src/app/services/project-serivce/shared-service.service';
interface CostItem {
  id: number;
  revenueItem: {
    costItemId: null,
    name: ''
  }
  location: any;
  totalCost: number;
  originDestination: string;
  editing: boolean;
}
@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent {
  projectLocations: any;
  projectId: any;
  projectName: any;
  subscription: any;
  locationDropdownOptions: any[] = [];
  revenueItemDropDownOptions: any[] = [];
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

   // this.getAllProjectOtherCost();
    this.getAllRevenueItem();
    if (this.projectIdCLI != null || this.projectIdCLI != undefined) {
      this.getAllProjectRevenueEdit(this.projectIdCLI);
      this.getAllLocations(this.projectIdCLI);
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
      revenueItem: {
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
    if (!editedItem.revenueItem || editedItem.totalCost === null || editedItem.totalCost === undefined) {
      this.messageService.add({
        key: 'errorToast',
        severity: 'error',
        summary: 'Error!',
        detail: 'Please fill all required fields before saving.'
      });
      return;
    }
    const selectedCostItem = this.revenueItemDropDownOptions.find(option => option.id === editedItem.revenueItem.costItemId);
    if (selectedCostItem) {
      editedItem.revenueItem.name = selectedCostItem.name;
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
  saveProjectsRevenueItem() {
    const invalidItem = this.tableData.find(item => !item.revenueItem || item.totalCost === null || item.totalCost === undefined);
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
      totalRevenue:   1,
      revenues: this.tableData.map(revenueItem => ({
        id: revenueItem.id,
        revenueItem: {
          id: revenueItem.revenueItem.costItemId,
          name: revenueItem.revenueItem.name
        },
        locationId: revenueItem.location.id,
        locationName: revenueItem.location.name,
        revenueAmount: this.calculateGrandTotalCost(),
        originDestinationCode: revenueItem.location.originDestinationCode
      }))
    };
    this.projectService.saveProjectRevenue(body).subscribe({
      next: (response: any) => {
        this.sharedService.setProjectIdOtherCost(response?.data?.projectId);
        this.sharedService.setDraftSavedOtherCost(true);
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Project Revenue Saved successfully.'
        });

      },
      error: (error) => {
        // this.messageService.add({
        //   key: 'errorToast',
        //   severity: 'error',
        //   summary: 'Error!',
        //   detail: 'Failed to Save Project Revenue.'
        // });
      }
    });
  }

  //------------------------Get Project Other Cost------------------------------//
  getAllProjectRevenueEdit(projId) {
    this.projectService.getAllProjectRevenue(projId).subscribe({
      next: (response: any) => {
        const otherCosts = response?.data?.revenues;
        if (Array.isArray(otherCosts)) {
          this.tableData = otherCosts.map((item: any, index: number) => ({
            id:item.id,
            revenueItem: {
              costItemId: item.revenueItem.id,
              name: item.revenueItem.name
            },
            location: {
              id: item.locationId,
              name: item.locationName,
              originDestinationCode: item.originDestinationCode
            },
            totalCost: item.totalCost,
            originDestination: item.originDestinationCode === 0 ? 'Origin' : item.originDestinationCode === 1 ? 'Destination' : 'Origin/Destination',
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
        //   detail: 'Failed to fetch Project Revenue.'
        // });
      }
    });

  }

  //------------------------get all Revenue Item from Master Data-------------------//

  getAllRevenueItem() {
    this.revenueItemDropDownOptions = [];
    this.masterDataSerivce.getAllRevenueDetails().subscribe((res: any) => {
      if (res?.message == "success") {
        this.revenueItemDropDownOptions = res?.data.map((item: any) => ({
          id: item.id,
          name: item.name
        }));
      } else {
        this.revenueItemDropDownOptions = [];
      }
    })
  }

  //--------------------get all Project location -----------------------------//
  getAllLocations(projId) {
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
      }
    });
  }

}

