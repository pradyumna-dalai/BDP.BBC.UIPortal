import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { Subscription, lastValueFrom } from 'rxjs';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { AppMainComponent } from 'src/app/app.main.component';
import { SharedServiceService } from 'src/app/services/project-serivce/shared-service.service';
import { ProjectBuildingBlocksLocation, SelectedBuildingBlockProcess } from 'src/app/common/model/project-building-blocks-location';
import { BuildingBlock, Configuration, LocationIdName, OriginDestinationService, Process, Location } from 'src/app/common/model/project-building-block';

interface SelectedConfiguration {
  configurableId: string;
  configurableName: string;
  locations: { locationId: number, locationName: string }[];
}
@Component({
  selector: 'app-building-block',
  templateUrl: './building-block.component.html',
  styleUrls: ['./building-block.component.scss'],
  providers: [TreeDragDropService]
})

export class BuildingBlockComponent implements OnInit, OnDestroy {

  // #region section to define the member variables.

  // HOLDS THE PROJECT ID PASSED FROM OTHER PAGE/COMPONENT TO THIS PAGE/COMPONENT AS AN ATTRIBUTE PARAMETER
  @Input() projectID: number | null;

  // Holds All the Building Block available for the system.
  buildingBlocks: TreeNode[];

  // Holds the Building blocks along with their configuration details and location info for the project.
  projectBuldingBlock: ProjectBuildingBlocksLocation;

  // Holds the project origin location 
  projectOriginLocations: LocationIdName[] = [];

  // Holds the project destination location 
  projectDestinationLocations: LocationIdName[] = [];

  // Holds the current status code of the project.
  projStatus: number;

  // Hods the Process Selected by user. This will be used as a two way binding in thne UI to show Orgin/ destination services.
  selectedBuildingBlockProcess: SelectedBuildingBlockProcess = null;

  originConfigurations: TreeNode[] = [];
  selectedOriginConfigurations: TreeNode[] = [];
  destinationConfigurations: TreeNode[] = [];
  selectedDestinationConfigurations: TreeNode[] = [];
  isOriginConfigurationVisible: boolean = true;
  isDestinationConfigurationVisible: boolean = false;

  //Holds the option value for Configuration Toggle Button
  configurationOptions: any[] = [
    { name: 'Origin Location', value: 1},
    { name: 'Destination Location', value: 2 }
  ];

  // #endregion



  constructor(private sharedService: SharedServiceService, private projectService: ProjectsService, private messageService: MessageService, private appMain: AppMainComponent, private buildingBlockService: CreateBuildingBlockService) {

  }

  async ngOnInit() {
    this.onPageLoad();
  }

  // This mentod is responsible for Page Load activities.
  private onPageLoad(): void {
    this.loadProjectLocations();
    this.loadAllAvailableBuildingBlock();
    this.loadProjectBuildingBlock();
  }

  /**
   * This method will load all locations for origin and destination defined in the project.
   */
  private loadProjectLocations(): void {
    lastValueFrom(this.projectService.getProjectDetails(this.projectID)).then((res) => {


      this.projStatus = res?.data?.projectStatus?.id;
      // Origin
      this.projectOriginLocations = res?.data?.projectLocation.filter(loc => loc.originDestinationCode === 0).map((l) => {
        return <LocationIdName>{
          locationId: l?.location?.id,
          locationName: l?.location?.name
        }
      });

      // Destination
      this.projectDestinationLocations = res?.data?.projectLocation.filter(loc => loc.originDestinationCode === 1).map((l) => {
        return <LocationIdName>{
          locationId: l?.location?.id,
          locationName: l?.location?.name
        }
      });

    })
      .catch((err) => {

      })
  }

  // #region Section for All available Building Block population
  /**
   * The method is used to load all the available building blocks in the system for the user to select
   */
  private async loadAllAvailableBuildingBlock() {
    // Call the API to get the Building Block Information and then calling the method to convert it into Tree view structure
    await lastValueFrom(this.buildingBlockService.getExplorerData(2)).then((res) => {
      this.buildingBlocks = this.transformDataForTreeNodeView(res.data);
      console.log(this.buildingBlocks);
    })
      .catch((err) => {
        console.error('Error loading tree data:', err);
      });
  }


  onProcessClick1(event: any) {
    console.log(event);
  }

  /**
   * Convert the Building block adata received from API to the Tree view structure
   * @param data 
   * @returns 
   */
  private transformDataForTreeNodeView(data: any[]): TreeNode[] {
    return data?.map((item) => {
      return {
        label: item.name || item.configurableName || item.locationName,
        data: item,
        id: item.configurableId || item.locationId,
        children: this.transformDataForTreeNodeView(item?.child || item?.locations || []),
      };
    });
  }
  // #endregion

  // #region section for loading the building blocks for the specific project

  /**
   * Load the Building blocks selected for the Project
   */
  private loadProjectBuildingBlock() {

    this.projectBuldingBlock = null;
    lastValueFrom(this.projectService.getProjectBuildingBlocks(this.projectID)).then((res) => {
      this.projectBuldingBlock = res?.data;
      this.projectBuldingBlock?.buildingBlocks?.forEach((bb) => {
        bb.processes.forEach(p => {

          // Loop through each configurations loctaions to see if all the loctaions 
          // which are there in projects are inherited to the configuration locations or not. 
          // If not then add those loactions to the configurations locations list.
          this.projectOriginLocations?.forEach(pol => {
            // Ensure the location is in the this.selectedBuildingBlockProcess.destinationService
            // If present mark the isSelected to true.
            // Else add the location to the list with isSelected to false.
            p?.originService?.configurations?.forEach(c => {
              if (c?.locations == null || c?.locations == undefined) {
                c.locations = [];
              }
              var locationIndex = c?.locations?.findIndex(l => l.locationId === pol.locationId);
              if (locationIndex != null && locationIndex != undefined && locationIndex != -1) {
                c.locations[locationIndex].isSelected = true;
              }
              else {
                c.locations.push(<Location>{
                  locationId: pol.locationId,
                  locationName: pol.locationName,
                  isSelected: false
                });
              }
            }
            )

          }
          );

          if (p.destinationService != undefined && p.destinationService != null && p.destinationService?.configurations?.length > 0) {
            p.destinationService.configurations = p?.destinationService?.configurations?.filter(f => f.configurableId != undefined || f.configurableId != null);
          }
          if (p.originService != undefined && p.originService != null && p.originService?.configurations?.length > 0) {
            p.originService.configurations = p?.originService?.configurations?.filter(f => f.configurableId != undefined || f.configurableId != null);
          }

          debugger;
          // If any process does not have any configuration or any location assigned to that specific configuration
          if ((p?.destinationService == undefined || p?.destinationService == null || p?.destinationService?.configurations?.length < 1) && 
          (p?.originService == undefined || p?.originService == null || p?.originService?.configurations?.length < 1)) {
            p.processActiveStatus = 0;
          }

          if((p?.destinationService?.configurations?.length > 0 && p?.destinationService?.configurations?.some(s=>s?.locations?.some(l=>l?.isSelected))) || 
          (p?.originService?.configurations?.length > 0 && p?.originService?.configurations?.some(s=>s?.locations?.some(l=>l?.isSelected))))
          {
            p.processActiveStatus = 2;
          }
          if((p?.destinationService?.configurations?.length < 0 && p?.destinationService?.configurations?.some(s=>s?.locations?.some(l=>!l?.isSelected))) || 
          (p?.originService?.configurations?.length < 0 && p?.originService?.configurations?.some(s=>s?.locations?.some(l=>!l?.isSelected))))
          {
            p.processActiveStatus = 1;
          }
        })
      })

      //Sort process steps order by process number ascending
      if(this.projectBuldingBlock?.buildingBlocks?.length > 0)
      {
        this.projectBuldingBlock?.buildingBlocks?.forEach(bb=>{
          bb.processes.sort((a,b)=>a.processNumber - b.processNumber)
        })
      }
    })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Remove a specific building Block from the BuildingBlocks selected for the Project
   */
  private removeBuidlingBlockFromProject(buildingBlockId: Number): void {

    this.projectBuldingBlock.buildingBlocks = this.projectBuldingBlock?.buildingBlocks?.filter(bb=>bb.buildingBlockId!=buildingBlockId);

  }


  // #endregion


  // #region Section to Add a new BB to a project

  /**
   * This method will be called from View to add a new Building block to project.
   */
  public onBuildingBlockAddition(buildingBlockId: number, buildingBlockName: string): void {
    var newBuildingBlock: BuildingBlock = null;
    // Validate if the building block is already added to the project then it will not add a new entry for the same building block in the project.
    if (this.projectBuldingBlock?.buildingBlocks?.some(s => s.buildingBlockId == buildingBlockId)) {
      return;
    }

    if (this.projectBuldingBlock == undefined || this.projectBuldingBlock == null) {
      this.projectBuldingBlock = new ProjectBuildingBlocksLocation();
      this.projectBuldingBlock.buildingBlocks = [];
    }

    lastValueFrom(this.projectService.getProcessStepByBlockId(buildingBlockId)).then((res) => {
      // Loop through each process to get a unique process steps and configurations available for it.
      if (res?.status === 200) {
        newBuildingBlock = new BuildingBlock();

        newBuildingBlock.buildingBlockId = buildingBlockId;
        newBuildingBlock.buildingBlockName = buildingBlockName;
        newBuildingBlock.processes = [];

        // Loop through each process 
        res?.data?.forEach(p => {

          // Initialize the New Proecss Object to add in the Building block
          var newProcess = new Process();
          newProcess.originService = new OriginDestinationService();
          newProcess.originService.configurations = [];

          newProcess.destinationService = new OriginDestinationService();
          newProcess.destinationService.configurations = [];

          var newConfiguration = new Configuration();
          newConfiguration.configurableId = p?.configurableId;
          newConfiguration.configurableName = p?.configurable;


          // Check if the Process doesn't have the Process number in it.
          var processIndex = newBuildingBlock.processes?.findIndex(np => np.processNumber === p.processNumber);
          // newProcess = newBuildingBlock.processes?.find(f=>f.processId===p.processNumber);
          // If blockIndex is not -1, it means the building block was found within the project
          if (processIndex !== -1) {
            newProcess = newBuildingBlock.processes[processIndex];

            //0 : OriginService, 1: Destination Service, 2: Both Origin and Destination Service
            if (p?.originDestinationCode == 0 || p?.originDestinationCode == 2) {
              newProcess.originService.configurations.push(newConfiguration);
            }
            else if (p?.originDestinationCode == 1 || p?.originDestinationCode == 2) {
              newProcess.destinationService.configurations.push(newConfiguration);
            }


          }
          else {

            newProcess.processId = p.id;
            newProcess.processName = p.operationStep;
            newProcess.processNumber = p.processNumber;

            if (p?.originDestinationCode == 0 || p?.originDestinationCode == 2) {
              newProcess.originService.configurations.push(newConfiguration);
            }
            else if (p?.originDestinationCode == 1 || p?.originDestinationCode == 2) {
              newProcess.destinationService.configurations.push(newConfiguration);
            }


            if (newProcess.destinationService != undefined && newProcess.destinationService != null && newProcess.destinationService?.configurations?.length > 0) {
              newProcess.destinationService.configurations = newProcess.destinationService?.configurations?.filter(f => f.configurableId != undefined || f.configurableId != null);
            }
            if (newProcess.originService != undefined && newProcess.originService != null && newProcess.originService?.configurations?.length > 0) {
              newProcess.originService.configurations = newProcess.originService?.configurations?.filter(f => f.configurableId != undefined || f.configurableId != null);
            }

            debugger;
            
            // If any process does not have any configuration or any location assigned to that specific configuration
          if ((newProcess?.destinationService == undefined || newProcess?.destinationService == null || newProcess?.destinationService?.configurations?.length < 1) && 
          (newProcess?.originService == undefined || newProcess?.originService == null || newProcess?.originService?.configurations?.length < 1)) {
            newProcess.processActiveStatus = 0;
          }

          if((newProcess?.destinationService?.configurations?.length > 0 && newProcess?.destinationService?.configurations?.some(s=>s?.locations?.some(l=>l?.isSelected))) || 
          (newProcess?.originService?.configurations?.length > 0 && newProcess?.originService?.configurations?.some(s=>s?.locations?.some(l=>l?.isSelected))))
          {
            newProcess.processActiveStatus = 2;
          }
          if((newProcess?.destinationService?.configurations?.length < 0 && newProcess?.destinationService?.configurations?.some(s=>s?.locations?.some(l=>!l?.isSelected))) || 
          (newProcess?.originService?.configurations?.length < 0 && newProcess?.originService?.configurations?.some(s=>s?.locations?.some(l=>!l?.isSelected))))
          {
            newProcess.processActiveStatus = 1;
          }

            newBuildingBlock.processes.push(newProcess);
          }


        });

        if (newBuildingBlock != null) {
          this.projectBuldingBlock.buildingBlocks.push(newBuildingBlock);
        }
      }
      console.log(this.projectBuldingBlock);

    })
      .catch((err) => {

      });


  }
  // #endregion



  // #region Save Building Block

  private saveProjectBuildingBlocks(): void {
    //Remove locations from the configuration of specific process

    this.projectBuldingBlock?.buildingBlocks?.forEach(bb => {
      bb?.processes?.forEach(pr => {

        pr?.destinationService?.configurations?.forEach(c => {
          //if there is any location selected
          c.locations = c?.locations?.filter(f => f.isSelected == true);
          // If there is no location for specific configuration
          pr.destinationService.configurations = pr?.destinationService?.configurations?.filter(f => f?.locations?.length > 0);
        });
        // If there are no configuration for destination
        pr.destinationService = pr?.destinationService?.configurations?.length < 1? null:pr?.destinationService;





        pr?.originService?.configurations?.forEach(c => {
          //if there is any location selected
          c.locations = c?.locations?.filter(f => f.isSelected == true);
          // If there is no location for specific configuration
          pr.originService.configurations = pr?.originService?.configurations?.filter(f => f?.locations?.length > 0);
        });

        // If there are no configuration for origin
        pr.originService = pr?.originService?.configurations?.length < 1? null:pr?.originService;        
      });
      bb.processes = bb?.processes.filter(prf=>(prf?.destinationService!=undefined && prf?.destinationService!=null) || (prf?.originService!=undefined && prf?.originService!=null));
    });


    lastValueFrom(this.projectService.saveProjectBuildingBlock(this.projectBuldingBlock)).then((res) => {
      this.loadProjectBuildingBlock();
      this.messageService.add({
        key: 'successToast',
        severity: 'success',
        summary: 'Success!',
        detail: 'Project Building Block saved successfully.'
      });
    })
      .catch((err) => {
        console.error('Error saving Project Building Block:', err);
      })
  }
  // #endregion

  /**
   * This method will hep in populating the selectedBuildingBlockProcess based on the selected process
   * @param buildingBlockId : Internal Id for the selected building block
   * @param processId : Internal Id for the selected building block.
   */
  public onProcessClick(buildingBlockId: number, processId: number) {
    // Find the exact process steps using building bloc id and process id.
    var selectedProcess = this.projectBuldingBlock.buildingBlocks.find(b => b.buildingBlockId === buildingBlockId)
      .processes.find(p => p.processId === processId);

    if (selectedProcess != null && selectedProcess != undefined) {
      // Initialize the object disaccociate the previous reference.
      this.selectedBuildingBlockProcess = new SelectedBuildingBlockProcess();


      this.selectedBuildingBlockProcess.buildingBlockId = buildingBlockId;
      this.selectedBuildingBlockProcess.processId = processId;
      this.selectedBuildingBlockProcess.processNumber = selectedProcess.processNumber;
      this.selectedBuildingBlockProcess.processName = selectedProcess.processName;

      // Shallow copy of the object, so any changes to the selectedBuildingBlockProcess.destinationService will impact the  selectedProcess.destinationService or vice versa.
      this.selectedBuildingBlockProcess.destinationService = selectedProcess.destinationService;

      // Shallow copy of the object, so any changes to the selectedBuildingBlockProcess.destinationService will impact the  selectedProcess.destinationService or vice versa.
      this.selectedBuildingBlockProcess.originService = selectedProcess.originService;

      // Loop through each configurations loctaions to see if all the loctaions 
      // which are there in projects are inherited to the configuration locations or not. 
      // If not then add those loactions to the configurations locations list.
      this.projectDestinationLocations?.forEach(pdl => {
        // Ensure the location is in the this.selectedBuildingBlockProcess.destinationService
        // If present mark the isSelected to true.
        // Else add the location to the list with isSelected to false.
        this.selectedBuildingBlockProcess?.destinationService?.configurations?.forEach(c => {
          if (c?.locations == null || c?.locations == undefined) {
            c.locations = [];
          }
          var locationIndex = c?.locations?.findIndex(l => l.locationId === pdl.locationId)
          if (locationIndex != null && locationIndex != undefined && locationIndex != -1) {
            c.locations[locationIndex].isSelected = true;
          }
          else {
            //  var newLocation = new Location();
            //  newLocation.locationId = pdl.locationId;
            //  newLocation.locationName = pdl.locationName;
            //  newLocation.isSelected = false;
            c.locations.push(<Location>{
              locationId: pdl.locationId,
              locationName: pdl.locationName,
              isSelected: false
            });
          }
        }
        )

      }
      );

      // Loop through each configurations loctaions to see if all the loctaions 
      // which are there in projects are inherited to the configuration locations or not. 
      // If not then add those loactions to the configurations locations list.
      this.projectOriginLocations?.forEach(pol => {
        // Ensure the location is in the this.selectedBuildingBlockProcess.destinationService
        // If present mark the isSelected to true.
        // Else add the location to the list with isSelected to false.
        this.selectedBuildingBlockProcess?.originService?.configurations?.forEach(c => {
          if (c?.locations == null || c?.locations == undefined) {
            c.locations = [];
          }
          var locationIndex = c?.locations?.findIndex(l => l.locationId === pol.locationId);
          if (locationIndex != null && locationIndex != undefined && locationIndex != -1) {
            // c.locations[locationIndex].isSelected = true;
          }
          else {
            c.locations.push(<Location>{
              locationId: pol.locationId,
              locationName: pol.locationName,
              isSelected: false
            });
          }
        }
        )

      }
      );

      // Transforming Origin Configurations data into Tree Node structure
      this.originConfigurations = this.transformDataForTreeNodeView(this.selectedBuildingBlockProcess?.originService?.configurations);

      // Getting Selected Origin Locations for specific configuration as Tree Node Structure
      this.selectedOriginConfigurations = [];
      this.originConfigurations?.forEach(oc => {
        oc?.children?.forEach(occ => {
          if (occ?.data?.isSelected) {
            this.selectedOriginConfigurations.push(occ);
          }
        })
      });

      // Transforming Destination Configurations data into Tree Node structure
      this.destinationConfigurations = this.transformDataForTreeNodeView(this.selectedBuildingBlockProcess?.destinationService?.configurations);

      // Getting Selected Destination Locations for specific configuration as Tree Node Structure
      this.selectedDestinationConfigurations = [];
      this.destinationConfigurations?.forEach(oc => {
        oc?.children?.forEach(occ => {
          if (occ?.data?.isSelected) {
            this.selectedDestinationConfigurations.push(occ);
          }
        })
      });
    }
    this.isOriginConfigurationVisible = true;
    this.isDestinationConfigurationVisible = false;

  }

  public toggleConfiguration(event) {
    console.log(event);
    switch (event?.value) {
      case 1:
        this.isOriginConfigurationVisible = true;
        this.isDestinationConfigurationVisible = false;
        break;
      case 2:
        this.isOriginConfigurationVisible = false;
        this.isDestinationConfigurationVisible = true;
        break;
      default:
        break;
    }
  }

  public onLocationSelection(configurationLocation: any) {
    console.log(this.projectBuldingBlock);
    // console.log(configurationLocation);

    var selectedLocation: Location = configurationLocation?.node?.data;
    selectedLocation.isSelected = !selectedLocation.isSelected;

    // var selectedConfigurationLocation:Configuration = configurationLocation?.node?.parent?.data;

    // this.projectBuldingBlock.buildingBlocks.forEach(bb=>{
    //   bb.processes.forEach(p=>{
    //     var configurationIndex = p.originService.configurations.findIndex(f=>f.configurableId==selectedConfigurationLocation.configurableId);
    //     if(configurationIndex != -1)
    //     {
    //       p.originService.configurations[configurationIndex]=selectedConfigurationLocation;
    //     }
    //   })
    // });

    console.log(this.projectBuldingBlock);

  }

  ngOnDestroy(): void {

  }

}