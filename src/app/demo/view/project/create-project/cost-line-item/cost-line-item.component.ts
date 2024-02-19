import { Component,Input } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedServiceService } from 'src/app/services/project-serivce/shared-service.service';

@Component({
  selector: 'app-cost-line-item',
  templateUrl: './cost-line-item.component.html',
  styleUrls: ['./cost-line-item.component.scss']
})
export class CostLineItemComponent {
  editing:boolean

  ///add voulume & CLI///
showOriginVolume: boolean = true;
showDestinationVolume: boolean = false;
originButtonColor: string = 'white';
destinationButtonColor: string = 'rgb(0, 110, 255)';
originButtonBorder: string = '1px solid rgb(0, 110, 255)';
destinationButtonBorder: string = '1px solid rgb(0, 110, 255)';
originButtonBorderRadius: string = '5px';
destinationButtonBorderRadius: string = '5px';
showOriginCLI: boolean = true;
showDestinationCLI:boolean = false;
//end//
visible:boolean = false;
private _isExpanded = false;
  costLineItemDetails: any;
  buildingBlockNames: any;
  originProcesses: any[] = [];
  buildingBlocks: any;
  allLines: any;
  costLineItemDetailsResponse: any;
  projectId: any;
  projectName: any;
  @Input() projectidVolume: number | null;
  projectIdCLI: any;
  draftSavedCLI: boolean = false;

constructor(private sharedService: SharedServiceService,private projectService:ProjectsService, private messageService: MessageService){

}

ngOnInit(){
  this.getCostLineItemDetails(this.projectidVolume);
  }


  //---------------------------------Cost line item--------------------------------------------//

showOriginSectionCLI() {
  this.showOriginCLI = true;
  this.showDestinationCLI = false;
  this.originButtonColor = 'white';
  this.destinationButtonColor = 'rgb(0, 110, 255)';
  this.originButtonBorder = '1px solid rgb(0, 110, 255)';
  this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
  this.originButtonBorderRadius = '5px';
  this.destinationButtonBorderRadius = '5px';
}

showDestinationSectionCLI() {
  this.showOriginCLI = false;
  this.showDestinationCLI = true;
  this.originButtonColor = 'rgb(0, 110, 255)';
  this.destinationButtonColor = 'white';
  this.originButtonBorder = '1px solid rgb(0, 110, 255)';
  this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
  this.originButtonBorderRadius = '5px';
  this.destinationButtonBorderRadius = '5px';
}
//---------------------------------End--------------------------------------------//
public get isExpanded() {
  return this._isExpanded;
}

showUploadDialog() {
  this.visible = true;
}


public set isExpanded(value: boolean) {
  this._isExpanded = value;
}

getCostLineItemDetails(projectId) {
  this.projectService.getCostLineItemDetails(projectId).subscribe((res: any) => {
    this.costLineItemDetails = res.data.buildingBlocks;
    
    this.projectId = res.data.projectId;
    this.projectName = res.data.projectName;
    this.buildingBlockNames = this.costLineItemDetails.map(block => block.buildingBlockName);
    if (res && res.data.buildingBlocks && res.data.buildingBlocks.length > 0) {
      this.buildingBlocks = res.data.buildingBlocks;
    }
  });
}
getConfigurableName(configurableId: number): string {
  switch(configurableId) {
    case 1:
      return 'EDI';
    case 2:
      return 'Manual';
    case 3:
      return 'Others';
    default:
      return 'Unknown';
  }
}
saveCostLineItemDetails() {
  if (this.costLineItemDetails && this.costLineItemDetails.length > 0) {
    const body = {
      projectId: this.projectId,
      projectName: this.projectName,
      buildingBlocks: this.costLineItemDetails
    };

    this.projectService.saveCostLineItemDetails(body).subscribe(
      (res) => {
        console.log(res?.data?.projectId,"cli");
        this.sharedService.setProjectIdCLI(res?.data?.projectId);
        this.sharedService.setDraftSavedCLI(true);
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Data saved successfully.'
        });
      },
      (error) => {
        this.messageService.add({
          key: 'errorToast',
          severity: 'error',
          summary: 'Error!',
          detail: 'Failed to save data.'
        });
      }
    );
  }
}
goToNextTab(){

}
onRowEditInit(line: any) {
  line.editing = true; // Set editing mode to true for the specific row
}

onRowEditSave(line: any) {
  // Save the edited data
  line.editing = false; // Exit editing mode
}

onRowEditCancel(line: any, ri: number) {
  // Cancel editing
  // Reset any changes made to the row
  line.editing = false; // Exit editing mode
}
onRowEditInitDL(line: any) {
  line.editing = true; // Set editing mode to true for the specific row
}

onRowEditSaveDL(line: any) {
  // Save the edited data
  line.editing = false; // Exit editing mode
}

onRowEditCancelDL(line: any, ri: number) {
  // Cancel editing
  // Reset any changes made to the row
  line.editing = false; // Exit editing mode
}

}
