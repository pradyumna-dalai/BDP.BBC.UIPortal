import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { AppMainComponent } from 'src/app/app.main.component';
import { SharedServiceService } from 'src/app/services/project-serivce/shared-service.service';
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
  //@Input() createProject;
  stepsArray:any[]=[];
  treeData: TreeNode[];
  treeDataNew: TreeNode[];
  subscription: Subscription;
  searchText: string = '';
  //selectedNode: TreeNode;
  buildingBlockDetails: any;
  private _isExpanded = false;
  loading: boolean = false;
  showOriginVolume: boolean = true;
  showDestinationVolume: boolean = false;
  originButtonColor: string = 'white';
  destinationButtonColor: string = 'rgb(0, 110, 255)';
  originButtonBorder: string = '1px solid rgb(0, 110, 255)';
  destinationButtonBorder: string = '1px solid rgb(0, 110, 255)';
  originButtonBorderRadius: string = '5px';
  destinationButtonBorderRadius: string = '5px';
  showOriginCLI: boolean = true;
  showDestinationCLI: boolean = false;
  selectedNodes: any[] = [];
  draggedNodeId: any;
  selectedStep: any = null;
  isOriginActive: boolean = true;
  isDestinationActive: boolean = false;
  activeIndex: number;
  projectLocations: any;
  treeDataCalculated: any;
  selectedLocationNodes: TreeNode[] = [];
 // projectId: any;
  projectName: any;
  buildingBlocks: any;
  getSavedBlocks: any;
  savedBlockedId: any;
  getSavedBlocksDD: any;
  selectedDestinationLocationNodes: any;
  selectedOriginLocationNodes: any;
  selectedOriginLocationNodesbody: any[] = [];
  draftSavedBB: boolean = false;
  projectIDbb: any;
  selectedBuildingBlocks: any[] = [];
  stepwithInfo = new Map();
  @Input() projectId: number | null;
  @Output() continueClicked: EventEmitter<any> = new EventEmitter();
  @Input() projinfoID: number | null;

  constructor(private sharedService: SharedServiceService, private projectService: ProjectsService, private messageService: MessageService, private appMain: AppMainComponent, private createBuildingBlockservice: CreateBuildingBlockService) {
    //  console.log(' :',this.getSavedBlocksDD);
    // this.projectService.draftData$.subscribe(data => {
    //   this.projectLocations = data?.data?.projectLocation.filter(loc => loc.originDestinationCode === 0 || loc.originDestinationCode === 1);
    //   this.projectId = data?.data?.id;
    //   this.projectName = data?.data?.projectInformation?.projectName;
    //   this.getAllProjectBuildingBlock(this.projectId);
    // });
    if(this.projinfoID!=null){
      this.getAllProjectBuildingBlock(this.projinfoID);
      this.fetchProjectInfomation(this.projinfoID);
      }
  }

  ngOnInit() {
    this.loadTreeDataNew();
    console.log(this.projinfoID,'projectid');
    if(this.projinfoID!=null){
    this.getAllProjectBuildingBlock(this.projinfoID);
    this.fetchProjectInfomation(this.projinfoID);
    }
    
  }
  onClickContinue() {
    // Emit event to notify parent component to move to next tab
    this.continueClicked.emit();
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  expandNode(node: TreeNode) {
    if (node.children) {
      node.expanded = true;
      node.children.forEach(childNode => {
        this.expandNode(childNode);
      });
    }
  }
  expandNodesBasedOnSearchResults() {
    this.treeDataNew.forEach((node) => {
      node.expanded = true;
      this.expandNode(node);
    });
  }
  loadTreeDataNew() {
    this.createBuildingBlockservice.getExplorerData(2).subscribe((data: any) => {
      this.treeDataNew = this.transformData(data.data);
    },
      (error) => {
        console.error('Error loading tree data:', error);
      });
  }
  onSearchChange() {
    if (this.searchText.trim() === '') {
      this.loadTreeDataNew();
    } else {
      // this.loadTreeDataNew(); 
      this.treeDataNew = this.filterTreeData(this.treeDataNew, this.searchText);
      this.expandNodesBasedOnSearchResults();
    }
  }
  private transformData(data: any[]): TreeNode[] {
    return data.map((item) => {
      return {
        label: item.name,
        data: item,
        children: this.transformData(item.child || []),
      };
    });
  }
  private filterTreeData(data: TreeNode[], searchText: string): TreeNode[] {
    if (!data) {
      return [];
    }

    return data
      .map(node => this.filterNode(node, searchText))
      .filter(filteredNode => filteredNode !== null);
  }
  private filterNode(node: TreeNode, searchText: string): TreeNode | null {
    if (!node) {
      return null;
    }

    if (node.data?.type === 4 && node.label.toLowerCase().includes(searchText.toLowerCase())) {
      return {
        ...node,
        children: this.filterChildNodes(node.children, searchText),
      };
    }

    const filteredChildren = this.filterChildNodes(node.children, searchText);

    if (filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
      };
    }

    return null;
  }
  private filterChildNodes(children: TreeNode[] | undefined, searchText: string): TreeNode[] {
    if (!children) {
      return [];
    }

    return children
      .map(childNode => this.filterNode(childNode, searchText))
      .filter(filteredNode => filteredNode !== null);
  }

  showOriginSection() {
    this.isOriginActive = true; // Setting isOriginActive to true
    this.isDestinationActive = false;
    this.originButtonColor = 'white';
    this.destinationButtonColor = 'rgb(0, 110, 255)';
    this.originButtonBorder = '1px solid rgb(0, 110, 255)';
    this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
    this.originButtonBorderRadius = '5px';
    this.destinationButtonBorderRadius = '5px';
    this.getTreeData(this.selectedStep, 0)
  }

  showDestinationSection() {
    this.isOriginActive = false; // Setting isOriginActive to false
    this.isDestinationActive = true;
    this.originButtonColor = 'rgb(0, 110, 255)';
    this.destinationButtonColor = 'white';
    this.originButtonBorder = '1px solid rgb(0, 110, 255)';
    this.destinationButtonBorder = '1px solid rgb(0, 110, 255)';
    this.originButtonBorderRadius = '5px';
    this.destinationButtonBorderRadius = '5px';
    this.getTreeData(this.selectedStep, 1)

  }

  //------------------------------drag and drop feature---------------------//
  onNodeSelect(event: any): void {
    const index = this.selectedNodes.findIndex(node => node.key === event.node.key);
    if (index === -1) {
      this.selectedNodes.push(event.node);
    } else {
      this.selectedNodes.splice(index, 1);
    }
  }
  onNodeDragStart(event: DragEvent, node: TreeNode): void {
    if (node.data?.type === 4) {
      if (!this.selectedNodes.includes(node)) {
        this.selectedNodes.push(node);
        this.draggedNodeId = node.data?.id;
        this.getAllProcessStepbyBlockId(this.draggedNodeId);
      }
    } else {
      event.preventDefault();
    }
  }

  onNodeDrop(event: DragEvent): void {
    event.preventDefault();
  }

  onNodeDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  public get isExpanded() {
    return this._isExpanded;
  }

  public set isExpanded(value: boolean) {
    this._isExpanded = value;
  }
  removeSelectedNode(node: TreeNode): void {
    const index = this.selectedNodes.findIndex(selectedNode => selectedNode.data.id === node.data.id);
    if (index !== -1) {
      this.selectedNodes.splice(index, 1);
    }
  }
  

  //-------------------------------end here--------------------------------//
  getAllProcessStepbyBlockId(blockId: any) {
    const node = this.selectedNodes.find(node => node.data.id === blockId);
    if (node) {
      this.projectService.getProcessStepByBlockId(blockId).subscribe({
        next: (response: any) => {
          if (Array.isArray(response.data)) {
            const stepsInformation: any[] = response.data.map((item: any) => {
              let originDestinationCode;
              if (item.originDestinationCode === 0) {
                originDestinationCode = 'Origin';
              } else if (item.originDestinationCode === 1) {
                originDestinationCode = 'Destination';
              } else if (item.originDestinationCode === 2) {
                originDestinationCode = 'Origin and Destination';
              } else {
                originDestinationCode = 'Unknown'; // Handle other cases if needed
              }

              return {
                blockId: item.blockId,
                blockName: item.block,
                stepId: item.id,
                stepName: item.operationStep,
                processNumber:item.processNumber,
                originDestinationCode: originDestinationCode,
                origin: [],
                destination: [],
                configurableId: item.configurableId,
                configurable: item.configurable,
                key: item.blockId + "." + item.id
              };
            });
            stepsInformation.sort((a, b) => {

              return Number(a.processNumber) - Number(b.processNumber);
        
            });
            this.updateNodeStepsInformation(node, stepsInformation);
          } else {
            // console.error('Data is not an array:', response.data);
          }
        },
        error: (error) => {
          console.error('Error in loading steps:', error);
        }
      });
    }
  }


  updateNodeStepsInformation(node: any, stepsInformation: any[]) {
    const updatedStepsInformation = {};
    
    let blockkeyId: number = 0;
    stepsInformation.forEach(stepInfo => {
      
      const operationStep = stepInfo.blockId + '.' + stepInfo.stepName;
      blockkeyId = stepInfo.blockId;
      if (!updatedStepsInformation[operationStep]) {
        updatedStepsInformation[operationStep] = {
          Origin: [],
          Destination: [],
          operationStepId: stepInfo.stepId,
          buildingBlockName: stepInfo.blockName,
          selectedOriginLoc: [],
          selectedDestinationLoc: [],
          key: stepInfo.key,
          blockId: stepInfo.blockId,
          stepName: stepInfo.stepName,
          processNumber:stepInfo.processNumber,

        };
      }
      // Add configurable and configurableId to origin or destination array based on originDestinationCode
      if (stepInfo.originDestinationCode === 'Origin') {
        updatedStepsInformation[operationStep].Origin.push({
          configurableId: stepInfo.configurableId,
          configurable: stepInfo.configurable
        });
      } else if (stepInfo.originDestinationCode === 'Destination') {
        updatedStepsInformation[operationStep].Destination.push({
          configurableId: stepInfo.configurableId,
          configurable: stepInfo.configurable
        });
      } else if (stepInfo.originDestinationCode === 'Origin and Destination') {
        updatedStepsInformation[operationStep].Origin.push({
          configurableId: stepInfo.configurableId,
          configurable: stepInfo.configurable
        });
        updatedStepsInformation[operationStep].Destination.push({
          configurableId: stepInfo.configurableId,
          configurable: stepInfo.configurable
        });
      }
    });


    this.stepwithInfo.set(blockkeyId, updatedStepsInformation);
    console.log('Send TO API Block Data to Extract', this.stepwithInfo);
    let updatedStepsInformationMap = new Map<string, any>();

    for (let key in updatedStepsInformation) {
        if (updatedStepsInformation.hasOwnProperty(key)) {
          updatedStepsInformationMap.set(key, updatedStepsInformation[key]);
        }
    }
    /*
    0-Grey
    1-Red
    2-Green
    */
    updatedStepsInformationMap.forEach(res=>{
      res.value={'blockId':0};
      res.value.blockId=res.blockId;
      if(res.Destination && (res.Destination.length==0 || 
        (res.Destination[0].configurable==null && 
        res.Destination[0].configurableId==null)) &&

        res.Origin && (res.Origin.length==0 || 
          (res.Origin[0].configurable==null && 
          res.Origin[0].configurableId==null))
        ){
        res.stepStatus=0;
      }
      else if((res.selectedDestinationLoc && res.selectedDestinationLoc.length==0 )
          && (res.selectedDestinationLoc && res.selectedDestinationLoc.length==0) ){
            res.stepStatus=1;
      }else{
        res.stepStatus=2;
      }
    })
    node.data.stepsInformation = Array.from(updatedStepsInformationMap);
    
    console.log('Step Information:', node.data.stepsInformation);
  }

  getByValue(map, searchKey) {
    for (let [key, value] of map.entries()) {
      if (key === searchKey)
        return value;
    }
  }

//   hasConfigurations(step: any): boolean {
//     const hasOriginConfig = step.Origin.length > 0;
//     const hasDestinationConfig = step.Destination.length > 0;
//     console.log('Step:', step.stepName, 'Has Origin Config:', hasOriginConfig, 'Has Destination Config:', hasDestinationConfig);
//     return hasOriginConfig && hasDestinationConfig;
// }
hasConfigurations(step: any): boolean {
  return step.Origin.length === 0 && step.Destination.length === 0;
}


  getTreeData(selectedStep: any, originDestinationCode: number): TreeNode[] {
    const blockId = selectedStep.value.blockId;
    const selectedNode = this.selectedNodes.find(node => node.data.id === blockId);
    const updatedStepsInformation = selectedNode?.data?.stepsInformation;
    const projectLocation = this.projectLocations;
    // if (!updatedStepsInformation || !projectLocation) {
    //   console.error('Data is not available to generate tree data');
    //   return [];
    // }
    let selectedOriginLocId = [];
    let selectedDestinationLocId = [];
    let seletedProcess=[];

    const treeData: TreeNode[] = [];
    updatedStepsInformation.forEach(element => {
      if(element[1].stepName==selectedStep.stepName && element[1].buildingBlockName==selectedStep.buildingBlockName){

        const stepInfo = element[1];
        let originDestination: string;


        
        if (this.getSavedBlocks && this.getSavedBlocks.buildingBlocks) {
            this.getSavedBlocks.buildingBlocks.forEach((ele) => {
                if (
                    ele.buildingBlockId == stepInfo.blockId &&
                    ele.buildingBlockName == stepInfo.buildingBlockName
                ) {
                    if (ele.processes) {
                        ele.processes.forEach((elem) => {
                            if (
                                elem.processNumber == stepInfo.processNumber &&
                                elem.processName == stepInfo.stepName
                            ) {
                              let idBuilder=stepInfo.blockId+"."+elem.processId;
                              if(elem.destinationService ){
                                elem.destinationService.configurations.forEach(conf=>{
                                  let destinationServiceIdBuilder=idBuilder+"."+conf.configurableId
                                  conf.locations.forEach(loc=>{
                                    selectedDestinationLocId.push(destinationServiceIdBuilder+"."+ loc.locationId)
                                  })
                                })
                              }
                              if(elem.originService ){
                                elem.originService.configurations.forEach(conf=>{
                                  let originServiceIdBuilder=idBuilder+"."+conf.configurableId
                                  conf.locations.forEach(loc=>{
                                    selectedOriginLocId.push(originServiceIdBuilder+"."+ loc.locationId)
                                  })
                                })
                              }
                              
                            }
                        });
                    }
                }
            });
        }



        if (originDestinationCode === 0) {
          originDestination = 'Origin';
        } else if (originDestinationCode === 1) {
          originDestination = 'Destination';
        } else if (originDestinationCode === 2) {
          originDestination = 'Origin/Destination';
        }

        const configurations = stepInfo[originDestination];
        configurations.forEach((config: any) => {
          if (config.configurableId != null) {
            const locationChildren: TreeNode[] = [];
            const uniqueLocationIds = new Set<number>();
            const filteredLocations = projectLocation.filter(loc => loc.originDestinationCode === originDestinationCode);
            filteredLocations.forEach((location: any) => {
              if (!uniqueLocationIds.has(location.location.id)) {
                const label = originDestinationCode === 0 ? location.location.name : location.name;
                locationChildren.push({
                  key: stepInfo.key + "." + config.configurableId + "." + location.location.id,//`${treeData.length}-${locationChildren.length}`,
                  label: location.location.name,
                  data: {
                    id: location.location.id,
                    name: location.location.name
                  }
                });
                uniqueLocationIds.add(location.location.id);
              }
            });

            treeData.push({
              key: stepInfo.key + "." + config.configurableId,//`${treeData.length}`,
              label: config.configurable,
              data: {
                id: config.configurableId,
                name: config.configurable
              },
              children: locationChildren,
              selectable: false
            });
          }
        });
      
      }
    });
    this.treeData = treeData;

    let origineArr=this.filterNodesBySelectedKeys(treeData, selectedOriginLocId);
    
    let finalOriginArray=origineArr.map(node => node.children || []);
    selectedStep.selectedOriginLoc=[...finalOriginArray]
    let destArr=this.filterNodesBySelectedKeys(treeData, selectedDestinationLocId);
    
    let finalDestArray=destArr.map(node => node.children || []);
    selectedStep.selectedDestinationLoc=[...finalDestArray]
    //console.log('locationtree', treeData);
    return treeData;
  }


  selectStep(step: any, originDestinationCode: number) {
    if (this.selectedStep !== null
      && this.selectedStep.key === step.key
      && this.selectedStep.value.blockId === step.value.blockId) {
      return;
    }
    // let stepdata = this.stepwithInfo[this.selectedStep];
    
    this.selectedOriginLocationNodes = [];
    this.selectedDestinationLocationNodes = [];
    this.selectedStep = step;

    if (step?.selectedOriginLoc?.length) {
      this.selectedOriginLocationNodes = step.selectedOriginLoc;
    }
    if (step?.selectedDestinationLoc?.length) {
      this.selectedDestinationLocationNodes = step.selectedDestinationLoc;
    }
   
    // if (originDestinationCode === 0 || originDestinationCode === 1) {
    // Only proceed if originDestinationCode is 0 or 1
    this.getTreeData(step, originDestinationCode,);
   
    // } else {
    //  console.error('Invalid originDestinationCode:', originDestinationCode);
    // }
  }


  onLocationNodeSelect(event: any): void {
    let mapVal = this.getByValue(this.stepwithInfo, this.selectedStep.value.blockId);
    let mapValMap = new Map<string, any>();

    for (let key in mapVal) {
        if (mapVal.hasOwnProperty(key)) {
          mapValMap.set(key, mapVal[key]);
        }
    }
    let stepdata
    mapValMap.forEach(element => {
      if(element.stepName==this.selectedStep.stepName && element.buildingBlockName==this.selectedStep.buildingBlockName){
      stepdata = element;
      }})
    
    stepdata.selectedOriginLoc = this.selectedOriginLocationNodes.map((node: any) => node);
    stepdata.selectedDestinationLoc = this.selectedDestinationLocationNodes.map((node: any) => node);
    //console.log('information', this.stepwithInfo);
    
  }

  //----------------------------------------Save Porject Draft------------------------------//
  onSaveProjectBBClick() {
    const projectData = {
      projectId: this.projectId || this.projinfoID,
      projectName: this.projectName,
      buildingBlocks: Array.from(this.stepwithInfo.entries()).map(([buildingBlockId, buildingBlockData]: [number, any]) => {
        const buildingBlockDataAny: any = buildingBlockData;
        const buildingBlockName = buildingBlockDataAny[Object.keys(buildingBlockDataAny)[0]]?.buildingBlockName;
  
        const processes = Object.entries(buildingBlockData).map(([_, processInfo]: [string, any]) => {
          if (processInfo.selectedOriginLoc.length > 0 || processInfo.selectedDestinationLoc.length > 0) {
            const originServiceConfigurations = [];
            const destinationServiceConfigurations = [];
  
            processInfo.selectedOriginLoc.forEach((loc: any) => {
              const configIndex = originServiceConfigurations.findIndex((config: any) => config.configurableId === loc.parent.data.id);
              if (configIndex > -1) {
                originServiceConfigurations[configIndex].locations.push({
                  locationId: loc.data.id,
                  locationName: loc.data.name
                });
              } else {
                originServiceConfigurations.push({
                  configurableId: loc.parent.data.id,
                  configurableName: loc.parent.data.name,
                  locations: [{
                    locationId: loc.data.id,
                    locationName: loc.data.name
                  }]
                });
              }
            });
  
            processInfo.selectedDestinationLoc.forEach((loc: any) => {
              const configIndex = destinationServiceConfigurations.findIndex((config: any) => config.configurableId === loc.parent.data.id);
              if (configIndex > -1) {
                destinationServiceConfigurations[configIndex].locations.push({
                  locationId: loc.data.id,
                  locationName: loc.data.name
                });
              } else {
                destinationServiceConfigurations.push({
                  configurableId: loc.parent.data.id,
                  configurableName: loc.parent.data.name,
                  locations: [{
                    locationId: loc.data.id,
                    locationName: loc.data.name
                  }]
                });
              }
            });
  
            return {
              processId: processInfo.operationStepId,
              processName: processInfo.stepName,
              originService: {
                configurations: originServiceConfigurations
              },
              destinationService: {
                configurations: destinationServiceConfigurations
              }
            };
          } else {
            return null;
          }
        }).filter(process => process !== null);
  
        return {
          buildingBlockId: buildingBlockId,
          buildingBlockName: buildingBlockName,
          processes: processes
        };
      }).filter(block => block.processes.length > 0)
    };
  
  
    this.projectService.saveProjectBuildingBlock(projectData).subscribe({
      next: (response: any) => {
        this.sharedService.setDraftSavedBB(true);
        this.sharedService.setProjectIDbb(response?.data?.projectId);
        this.draftSavedBB = true;
        this.projectIDbb = response.projectId;
        this.messageService.add({
          key: 'successToast',
          severity: 'success',
          summary: 'Success!',
          detail: 'Project Building Block saved successfully.'
        });
      },
      error: (error) => {
        console.error('Error saving Project Building Block:', error);
      }
    });
  }
  



  goToNextTab() {
    this.activeIndex = (this.activeIndex + 2) % 8
  }
  //----------------------------------------------------end-----------------------------------//
  updateSelectedBuildingBlock(node: TreeNode, originDestinationCode: number): void {
    const index = this.selectedBuildingBlocks.findIndex(block => block.buildingBlockId === node.data.id);
    if (index !== -1) {
      // Update existing building block
      const selectedBlock = this.selectedBuildingBlocks[index];
      selectedBlock.processes = Object.keys(node.data.stepsInformation).map((operationStep: string) => {
        const stepInfo = node.data.stepsInformation[operationStep];
        return {
          processId: stepInfo.operationStepId,
          processName: operationStep,
          originService: originDestinationCode === 0 ? this.getSelectedConfigurations(stepInfo.Origin) : [],
          destinationService: originDestinationCode === 1 ? this.getSelectedConfigurations(stepInfo.Destination) : []
        };
      });
    } else {
      // Add new building block
      const newBlock = {
        buildingBlockId: node.data.id,
        buildingBlockName: node.label,
        processes: Object.keys(node.data.stepsInformation).map((operationStep: string) => {
          const stepInfo = node.data.stepsInformation[operationStep];
          return {
            processId: stepInfo.operationStepId,
            processName: operationStep,
            originService: originDestinationCode === 0 ? this.getSelectedConfigurations(stepInfo.Origin) : [],
            destinationService: originDestinationCode === 1 ? this.getSelectedConfigurations(stepInfo.Destination) : []
          };
        })
      };
      this.selectedBuildingBlocks.push(newBlock);
    }
  }
  // Function to get the selected configurations
  getSelectedConfigurations(configurations: SelectedConfiguration[]): SelectedConfiguration[] {
    return configurations.filter(config => {
      return this.isOriginActive ? this.selectedOriginLocationNodes.some(location => location.data.id === config.locations[0].locationId) :
        this.selectedDestinationLocationNodes.some(location => location.data.id === config.locations[0].locationId);
    });
  }

  getAllProjectBuildingBlock(_projinfoID) {
      this.projectService.getProjectBuildingBlocks(this.projinfoID).subscribe({
        next: (response: any) => {
          this.getSavedBlocks = response.data;
          this.getSavedBlocksDD = response.data.buildingBlocks.map((block: any) => ({
            buildingBlockId: block.buildingBlockId,
            buildingBlockName: block.buildingBlockName
          }));
          this.matchBuildingBlocksToNodes();
        }
      });
    
  }

  matchBuildingBlocksToNodes(): void {
    this.getSavedBlocksDD.forEach((block: any) => {
      const matchedNode = this.findNodeById(block.buildingBlockId, this.treeDataNew);
      if (matchedNode) {
        this.selectedNodes.push(matchedNode);
        this.getAllProcessStepbyBlockId(block.buildingBlockId);
      }
    });
  }

  findNodeById(id: any, nodes: TreeNode[]): TreeNode | null {
    for (const node of nodes) {
      if (node.data && node.data.id === id) {
        return node;
      }
      if (node.children) {
        const foundNode = this.findNodeById(id, node.children);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  }


  fetchProjectInfomation(projinfoID): void {
    this.projectService.getProjectDetails(projinfoID).subscribe((res: any) => {
      if (res?.message === 'success') {
        this.projectLocations = res?.data?.projectLocation.filter(loc => loc.originDestinationCode === 0 || loc.originDestinationCode === 1);
        console.log('InfoOf Project',this.projinfoID);
      } else {
        console.log('Project Information is Not Found');
      }
    });
  }



  filterNodesBySelectedKeys(nodes: any[], selectedKeys: string[], parent?: any): any[] {
    const filteredNodes: any[] = [];

    nodes.forEach(node => {
        if (selectedKeys.includes(node.key)) {
            const filteredNode: any = {
                key: node.key,
                label: node.label,
                data: node.data,
                parent: parent,
                partialSelected: false
            };
            filteredNodes.push(filteredNode);
        } else if (node.children) {
            const filteredChildren = this.filterNodesBySelectedKeys(node.children, selectedKeys, {
                key: node.key,
                label: node.label,
                data: node.data,
                parent: parent,
                partialSelected: false
            });
            if (filteredChildren.length > 0) {
                const newNode: any = {
                    key: node.key,
                    label: node.label,
                    data: node.data,
                    parent: parent,
                    partialSelected: false
                };
                newNode.children = filteredChildren;
                filteredNodes.push(newNode);
            }
        }
    });

    return filteredNodes;
}

}