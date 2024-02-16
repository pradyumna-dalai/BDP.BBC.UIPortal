import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-volume',
  templateUrl: './add-volume.component.html',
  styleUrls: ['./add-volume.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AddVolumeComponent implements OnInit {

Add_Volume:any;

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
private _isExpanded = false;
visible: boolean = false;
  volumeDetails: any[]= [];
  dynamicColumns: any[] = [];
  allData: { projectId: any; projectName: any; buildingBlocks: any; };
  constructor(private projectService:ProjectsService, private messageService: MessageService){

  }

  ngOnInit(){
  this.getVolumeDetails(374);
  }
  public get isExpanded() {
    return this._isExpanded;
}

public set isExpanded(value: boolean) {
    this._isExpanded = value;
}
showUploadDialog() {
  this.visible = true;
}
  shareFunctionAddVolume(){
    this.projectService.buildingData$.subscribe((res)=>{
      console.log("call Add",res);
      this.Add_Volume = res
    })
  }
  //---------------------------------ADD VOLUME--------------------------------------------//
showOriginSection() {
  this.showOriginVolume = true;
  this.showDestinationVolume = false;
  this.originButtonColor = 'white';
  this.destinationButtonColor = 'rgb(0, 110, 255)';
  this.originButtonBorder = '1px solid rgb(0, 110, 255)';
  this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
  this.originButtonBorderRadius = '5px';
  this.destinationButtonBorderRadius = '5px';
}

showDestinationSection() {
  this.showOriginVolume = false;
  this.showDestinationVolume = true;
  this.originButtonColor = 'rgb(0, 110, 255)';
  this.destinationButtonColor = 'white';
  this.originButtonBorder = '1px solid rgb(0, 110, 255)';
  this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
  this.originButtonBorderRadius = '5px';
  this.destinationButtonBorderRadius = '5px';
}

getVolumeDetails(projectId) {
  this.projectService.getvolumeDetails(projectId).subscribe((res: any) => {
    if (res && res.data && res.data.buildingBlocks && res.data.buildingBlocks.length > 0) {
      // Extracting all building blocks
      const buildingBlocksData = res.data.buildingBlocks.map(block => {
        return {
          buildingBlockId: block.buildingBlockId,
          buildingBlockName: block.buildingBlockName,
          originService: block.originService,
          destinationService: block.destinationService
        };
      });
      
      // Storing all data
      this.allData = {
        projectId: res.data.projectId,
        projectName: res.data.projectName,
        buildingBlocks: buildingBlocksData
      };

      // Storing volume details for dynamic columns
      this.volumeDetails = res.data.buildingBlocks;
      this.dynamicColumns = this.volumeDetails.reduce((acc, curr) => {
        curr.originService.processes[0].lines[0].locationVolume.forEach(location => {
          if (!acc.includes(location.locationName)) {
            acc.push(location.locationName);
          }
        });
        return acc;
      }, []);
    }
  });
}
getLocationVolumeValue(buildingBlock: any, col: any): any {
  // Implement the logic to get the value here, for example:
  return this.getLocationVolume(buildingBlock, col);
}

setLocationVolumeValue(newValue: any, buildingBlock: any, col: any): void {
  // Assuming buildingBlock contains the volume details for each location
  // Find the location volume object corresponding to the column
  const location = buildingBlock.originService.processes[0].lines[0].locationVolume.find(loc => loc.locationName === col);
  // Update the volume value
  if (location) {
    location.volume = newValue;
  }
}
getLocationVolume(buildingBlock: any, locationName: string): string {
  // Implement logic to get the volume for the specified location
  // For example:
  const location = buildingBlock.originService.processes[0].lines[0].locationVolume.find(loc => loc.locationName === locationName);
  return location ? location.volume : '';
}


onRowEditSave(buildingBlock: any) {
  // Save logic
  buildingBlock.editing = false;
}

onRowEditCancel(buildingBlock: any, ri: number) {
  // Restore original values when cancelling edit mode
  if (buildingBlock.dynamicColumns && buildingBlock.dynamicColumns.length > 0) {
    buildingBlock.dynamicColumns.forEach(col => {
      buildingBlock[col] = buildingBlock[col + '_original'];
    });
  }
  buildingBlock.editing = false;
}


toggleEditMode(buildingBlock: any) {
  buildingBlock.editing = !buildingBlock.editing;
  if (buildingBlock.editing && buildingBlock.dynamicColumns && buildingBlock.dynamicColumns.length > 0) {
      buildingBlock.dynamicColumns.forEach(col => {
          // Store the original value before switching to edit mode
          buildingBlock[col + '_original'] = buildingBlock[col];
          // Initialize input value with the original value
          buildingBlock[col + '_input'] = buildingBlock[col];
      });
  }
}
onRowEditInit(buildingBlock: any) {
  buildingBlock.editing = true;
  buildingBlock.dynamicColumnsInput = {};
  this.dynamicColumns.forEach(col => {
    buildingBlock.dynamicColumnsInput[col] = this.getLocationVolume(buildingBlock, col);
  });
}
onSaveVolumeClick(){
  // const body ={
  //   projectId: 376,
  //   projectName: "SampleProject",
  //   buildingBlocks: [
  //       {
  //           buildingBlockId: 692,
  //           buildingBlockName: "VOT",
  //           originService: {
  //               processes: [
  //                   {
  //                       processId: 44,
  //                       processName: "sample",
  //                       lines: [
  //                           {
  //                               uomId: 1,
  //                               uomName: "Order",
  //                               configurableId: 1,
  //                               configurable: "Manual",
  //                               locationVolume: [
  //                                   {
  //                                       locationId: 1,
  //                                       locationName: "Antwerp",
  //                                       volume: 400
  //                                   },
  //                                   {
  //                                       locationId: 2,
  //                                       locationName: "Navashava",
  //                                       volume: 300
  //                                   }
  //                               ]
  //                           }
  //                       ]
  //                   }
  //               ]
  //           },
  //           destinationService: {
  //               processes: [
  //                   {
  //                       processId: 44,
  //                       processName: "sample",
  //                       lines: [
  //                           {
  //                               uomId: 32,
  //                               uomName: "PO",
  //                               configurableId: 2,
  //                               configurable: "Manual",
  //                               locationVolume: [
  //                                   {
  //                                       locationId: 3,
  //                                       locationName: "Antwerp",
  //                                       volume: 200
  //                                   },
  //                                   {
  //                                       locationId: 4,
  //                                       locationName: "Navashava",
  //                                       volume: 100
  //                                   }
  //                               ]
  //                           }
  //                       ]
  //                   }
  //               ]
  //           }
  //       }
  //   ]

  // }
  this.projectService.savevolumeDetails(this.allData).subscribe(
    (res) => {
      
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
goToNextTab(){
  
}

}