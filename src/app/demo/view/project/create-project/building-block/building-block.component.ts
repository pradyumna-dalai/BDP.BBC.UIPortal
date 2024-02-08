import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { TreeDragDropService, TreeNode } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { Accordion } from 'primeng/accordion';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppMainComponent } from 'src/app/app.main.component';
import { NodeService } from 'src/app/demo/service/nodeservice';
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
  constructor(private projectService: ProjectsService, private appMain: AppMainComponent, private createBuildingBlockservice: CreateBuildingBlockService) {
  }

  ngOnInit() {
    console.log('BuildingBlockComponent: ngOnInit');


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
                    // Create an object to store the information
                    const stepsInformation: any = {};
                    
                    // Iterate through each item in the response data
                    response.data.forEach((item: any) => {
                        // Extract operation step, origin destination, and configurable
                        const { operationStep, originDestination, configurable } = item;

                        // If the operation step doesn't exist in the object, initialize it
                        if (!stepsInformation[operationStep]) {
                            stepsInformation[operationStep] = {
                                Origin: [],
                                Destination: []
                            };
                        }

                        // Push the configurable value into the appropriate array based on originDestination
                        stepsInformation[operationStep][originDestination].push(configurable);
                    });

                    // Update the node's data with stepsInformation
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

updateNodeStepsInformation(node: any, stepsInformation: any) {
    node.data.stepsInformation = stepsInformation;
    console.log(stepsInformation);

}

selectStep(step: string) {
  this.selectedStep = step; 
}
// Inside your component class

getTreeData(selectedStep: string, originDestination: string) {
  if (selectedStep) {
      const node = this.treeDataNew.find(node => node.label === selectedStep);
      if (node) {
          return node.data?.stepsInformation?.[originDestination] || [];
      }
  }
  return [];
}

}