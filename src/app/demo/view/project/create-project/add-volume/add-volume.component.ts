import { Component, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';

@Component({
  selector: 'app-add-volume',
  templateUrl: './add-volume.component.html',
  styleUrls: ['./add-volume.component.scss']
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
  constructor(private projectService:ProjectsService){

  }

  ngOnInit(){
  this.getVolumeDetails(1);
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
getLocationNames(): string[] {
  const locationNames: string[] = [];
  if (this.volumeDetails && this.volumeDetails.length > 0) {
    const configurations = this.volumeDetails[0]?.processes[0]?.originService?.configurations;
    if (configurations) {
      configurations.forEach(configuration => {
        configuration.locations.forEach(location => {
          if (!locationNames.includes(location.locationName)) {
            locationNames.push(location.locationName);
          }
        });
      });
    }
  }
  return locationNames;
}
getVolumeDetails(projectId) {
  this.projectService.getvolumeDetails(projectId).subscribe((res: any) => {
    this.volumeDetails = res.data.buildingBlocks;
    if (this.volumeDetails.length > 0) {
      // Assuming location names structure is consistent across all building blocks
      this.dynamicColumns = this.volumeDetails.reduce((acc, curr) => {
        curr.processes[0].originService.configurations[0].locations.forEach(location => {
          if (!acc.includes(location.locationName)) {
            acc.push(location.locationName);
          }
        });
        return acc;
      }, []);
    }
   
  });
}
getLocationVolume(buildingBlock: any, locationName: string): string {
  // Implement logic to get the volume for the specified location
  // For example:
  const location = buildingBlock.processes[0].originService.configurations[0].locations.find(loc => loc.locationName === locationName);
  return location ? location.volume : '';
}

// getVolumeForLocation(configuration: any, locationName: string): number {
//   const location = configuration.locations.find(loc => loc.locationName === locationName);
//   return location ? location.volume : 0;
// }
// setVolumeForLocation(configuration: any, locationName: string, volume: number) {
//   const location = configuration.locations.find(loc => loc.locationName === locationName);
//   if (location) {
//     location.volume = volume;
//   }
// }
onSaveVolumeClick(){
  const body ={
    projectId: 1,
    projectName: "Sample",
    BuildingBlocks: [
      {
        buildingBlockId: 1,
        buildingBlockName: "VOTAir",
        originService: {
          processes: [
            {
              processId: 1,
              processName: "sample",
              lines: [
                {
                  uom: "Container",
                  configurable: "Manual",
                  locationVolume: [
                    {
                      locationName: "Antwerp",
                      unloc: "BEANR",
                      volume: 100
                    },
                    {
                      locationName: "Navashava",
                      unloc: "INNSA",
                      volume: 100
                    }
                  ]
                }
              ]
            }
          ]
        },
        destinationService: {
          processes: [
            {
              processId: 1,
              processName: "sample",
              lines: [
                {
                  uom: "Container",
                  configurable: "Manual",
                  locationVolume: [
                    {
                      locationName: "Antwerp",
                      unloc: "BEANR",
                      volume: 100
                    },
                    {
                      locationName: "Navashava",
                      unloc: "INNSA",
                      volume: 100
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ]
  }
  this.projectService.savevolumeDetails(body).subscribe(
    (res) => {
      
      console.log(res,"kk");
    },
    (error) => {

     
    }
  );

}
goToNextTab(){
  
}

}