import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { AppMainComponent } from 'src/app/app.main.component';

@Component({
  selector: 'app-building-block',
  templateUrl: './building-block.component.html',
  styleUrls: ['./building-block.component.scss'],
  providers: [TreeDragDropService]
})

export class BuildingBlockComponent implements OnInit, OnDestroy {
  //@Input() createProject;
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
  selectedNodes: TreeNode[] = [];
  draggedNodeId: any;
  selectedStep: any = null;
  isOriginActive: boolean = true;
  isDestinationActive: boolean = false;
  activeIndex: number;
  projectLocations: any;
  treeDataCalculated: any;
  selectedLocationNodes: TreeNode[] = [];
  projectId: any;
  projectName: any;
  buildingBlocks: any;
  getSavedBlocks: any;
  savedBlockedId: any;
  getSavedBlocksDD: any;

  constructor(private projectService: ProjectsService, private messageService: MessageService, private appMain: AppMainComponent, private createBuildingBlockservice: CreateBuildingBlockService) {
    this.getAllProjectBuildingBlock(this.projectId);
  }

  ngOnInit() {
    this.projectService.draftData$.subscribe(data => {
      this.projectLocations = data.data.projectLocation.filter(loc => loc.originDestinationCode === 0 || loc.originDestinationCode === 1);
      this.projectId = data.data.id;
      this.projectName = data.data.projectInformation.projectName;
      console.log('Filtered projectLocation:', this.projectLocations);
      console.log('Draft data:', this.projectId);
      this.getAllProjectBuildingBlock(this.projectId);
      console.log('bbsave',this.getSavedBlocksDD);
      const buildingBlock = this.getSavedBlocks.buildingBlocks.find(block => block.buildingBlockId === this.projectId);
      if (buildingBlock) {
        // Create a TreeNode object for the building block
        const buildingBlockNode: TreeNode = {
          label: buildingBlock.buildingBlockName,
          data: {
            id: buildingBlock.buildingBlockId,
            name: buildingBlock.buildingBlockName
          },
          children: []
        };
  
        // Set the selectedNodes property with the building block node
        this.selectedNodes = [buildingBlockNode];
      }
    });

    this.loadTreeDataNew();
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
      console.log("treee", this.treeDataNew)
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
    console.log('isOriginActive:', this.isOriginActive); // Log status of origin flag
    console.log('isDestinationActive:', this.isDestinationActive)

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

  //-------------------------------end here--------------------------------//
  getAllProcessStepbyBlockId(blockId: any) {
    const node = this.selectedNodes.find(node => node.data.id === blockId);
    if (node) {
      this.projectService.getProcessStepByBlockId(blockId).subscribe({
        next: (response: any) => {
          if (Array.isArray(response.data)) {
            const stepsInformation: any[] = response.data.map((item: any) => {
              const originDestinationCode = item.originDestinationCode === 0 ? 'Origin' : 'Destination';
              return {
                blockName: item.block,
                stepId: item.id,
                stepName: item.operationStep,
                originDestinationCode: originDestinationCode,
                origin: [],
                destination: [],
                configurableId: item.configurableId,
                configurable: item.configurable
              };
            });
            this.updateNodeStepsInformation(node, stepsInformation);
          } else {
            console.error('Data is not an array:', response.data);
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
    stepsInformation.forEach(stepInfo => {
      const operationStep = stepInfo.stepName;
      if (!updatedStepsInformation[operationStep]) {
        updatedStepsInformation[operationStep] = {
          Origin: [],
          Destination: [],
          operationStepId: stepInfo.stepId,
          buildingBlockName: stepInfo.blockName
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
      }
    });

    node.data.stepsInformation = updatedStepsInformation;
    console.log('Step Information:', node.data.stepsInformation);
  }


  getTreeData(selectedStep: string, originDestinationCode: number): TreeNode[] {
    const updatedStepsInformation = this.selectedNodes[0]?.data?.stepsInformation;
    const projectLocation = this.projectLocations;
    console.log('Selected Step:', selectedStep);
    console.log('Origin Destination Code:', originDestinationCode);
    console.log('Updated Steps Information:', updatedStepsInformation);
    console.log('Project Locations:', projectLocation);
    if (!updatedStepsInformation || !projectLocation) {
      console.error('Data is not available to generate tree data');
      return [];
    }
    const treeData: TreeNode[] = [];
    for (const operationStep in updatedStepsInformation) {
      if (operationStep === selectedStep) {
        const stepInfo = updatedStepsInformation[operationStep];
        let originDestination: string;

        if (originDestinationCode === 0) {
          originDestination = 'Origin';
        } else if (originDestinationCode === 1) {
          originDestination = 'Destination';
        } else if (originDestinationCode === 2) {
          originDestination = 'Origin/Destination';
        }

        const configurations = stepInfo[originDestination];
        configurations.forEach((config: any) => {
          const locationChildren: TreeNode[] = [];
          const uniqueLocationIds = new Set<number>();
          const filteredLocations = projectLocation.filter(loc => loc.originDestinationCode === originDestinationCode);
          filteredLocations.forEach((location: any) => {
            if (!uniqueLocationIds.has(location.location.id)) {
              const label = originDestinationCode === 0 ? location.location.name : location.name;
              locationChildren.push({
                key: `${treeData.length}-${locationChildren.length}`,
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
            key: `${treeData.length}`,
            label: config.configurable,
            data: {
              id: config.configurableId,
              name: config.configurable
            },
            children: locationChildren,
            selectable: false
          });
        });
      }
    }

    this.treeData = treeData;
    console.log('locationtree', treeData);
    return treeData;
  }


  selectStep(step: string, originDestinationCode: number) {
    if (this.selectedStep !== null && this.selectedStep === step) {
      return;
    }
    this.selectedStep = step;
    if (originDestinationCode === 0 || originDestinationCode === 1) {
      // Only proceed if originDestinationCode is 0 or 1
      this.getTreeData(step, originDestinationCode);
    } else {
      console.error('Invalid originDestinationCode:', originDestinationCode);
    }
  }


  onLocationNodeSelect(event: any): void {
    console.log('Event:', event);
    console.log('Event node:', event.node);
    if (!event.node || !event.node.children) {
      console.error('Invalid node selected:', event.node);
      return;
    }
    if (event.node.children.length > 0) {
      console.log('Cannot select parent nodes.');
      return;
    }
    event.node.children.forEach(child => {
      const index = this.selectedLocationNodes.findIndex(node => node.key === child.key);
      if (index === -1) {
        this.selectedLocationNodes.push(child.key);
        console.log('checkbox', this.selectedLocationNodes);
      } else {
        this.selectedLocationNodes.splice(index, 1);
      }
    });
  }

  //----------------------------------------Save Porject Draft------------------------------//
  onSaveProjectBBClick() {
    const body = {
      projectId: this.projectId,
      projectName: this.projectName,
      buildingBlocks: this.selectedNodes.map(node => {
        return {
          buildingBlockId: node.data.id,
          buildingBlockName: node.label,
          processes: Object.keys(node.data.stepsInformation).map((operationStep: string) => {
            const stepInfo = node.data.stepsInformation[operationStep];
            return {
              processId: stepInfo.operationStepId,
              processName: operationStep,
              originService: {
                configurations: stepInfo.Origin.map((config: any) => {
                  return {
                    configurationId: config.configurableId || '',
                    configurationName: config.configurable || '',
                    locations: this.selectedLocationNodes.map(locationNode => ({
                      locationId: locationNode.data.id,
                      locationName: locationNode.label
                    }))

                  };
                })
              },
              destinationService: {
                configurations: stepInfo.Destination.map((config: any) => {
                  return {
                    configurationId: config.configurableId || '',
                    configurationName: config.configurable || '',
                    locations: this.selectedLocationNodes.map(locationNode => ({
                      locationId: locationNode.data.id,
                      locationName: locationNode.label
                    }))
                  };
                })
              }
            };
          })
        };
      })
    };

    console.log('Request Body:', body);
    this.projectService.saveProjectBuildingBlock(body).subscribe({
      next: (response: any) => {
        console.log('Project Building Block saved successfully:', response);
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


  getAllProjectBuildingBlock(projectId: any) {
    if(this.projectId !=null){
      this.projectService.getProjectBuildingBlocks(this.projectId).subscribe({
        next: (response: any) => {
        // if (Array.isArray(response.data)) {
          this.getSavedBlocks= response.data;
          this.getSavedBlocksDD = response.data.buildingBlocks.map((block: any) => ({
              buildingBlockId: block.buildingBlockId,
              buildingBlockName: block.buildingBlockName
            }));
            console.log('bbsave',this.getSavedBlocksDD);
        // } 
    }
    });
  }
  }

}