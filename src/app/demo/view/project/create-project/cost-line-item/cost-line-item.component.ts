import { Component } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { ConfirmationService, MessageService } from 'primeng/api';

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

constructor(private projectService:ProjectsService, private messageService: MessageService){

}

ngOnInit(){
  this.getCostLineItemDetails(374);
  }
  onRowEditInit(event:any){

  }
  onRowEditSave(event:any){

  }
  onRowEditCancel(){
    
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
    this.costLineItemDetails = res.BuildingBlocks;
    this.buildingBlockNames = this.costLineItemDetails.map(block => block.buildingBlockName);
    if (res && res.BuildingBlocks && res.BuildingBlocks.length > 0) {
      this.buildingBlocks = res.BuildingBlocks;
    }
  });
}
}
