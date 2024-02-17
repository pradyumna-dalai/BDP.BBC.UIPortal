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
  buildingBlocks: any;
  buildingBlockNames: any[];
  constructor(private projectService:ProjectsService, private messageService: MessageService){

  }

  ngOnInit(){
  this.getVolumeDetails(338);
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
          // this.volumeDetails = res.data.buildingBlocks;
          this.buildingBlocks = res.data.buildingBlocks;
          this.buildingBlockNames = this.buildingBlocks.map(block => block.buildingBlockName);
        }
  });
}
 // Helper method to get unique location names from all lines
 getLocationNames(lines: any[]): string[] {
  let locationNames: string[] = [];
  lines.forEach(line => {
    line.locationVolume.forEach(location => {
      if (!locationNames.includes(location.locationName)) {
        locationNames.push(location.locationName);
      }
    });
  });
  return locationNames;
}

getLocationVolumes(locationVolume: any[], locationName: string): string | number {
  const location = locationVolume.find(loc => loc.locationName === locationName);
  return location ? location.volume : 'NA';
}
getConfigurableName(configurableId: number): string {
  switch (configurableId) {
      case 1:
          return 'EDI';
      case 2:
          return 'Manual';
      case 3:
          return 'Others';
      default:
          return ''; // You might want to handle other cases appropriately
  }
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

toggleEditMode(line: any) {
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
toggleEditModeDL(line: any) {
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


onSaveVolumeClick(){
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