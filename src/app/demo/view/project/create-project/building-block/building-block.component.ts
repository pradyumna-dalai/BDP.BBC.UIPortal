import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProjectsService } from 'src/app/services/project-serivce/projects.service';
import { TreeNode } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { Accordion } from 'primeng/accordion';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppMainComponent } from 'src/app/app.main.component';
@Component({
  selector: 'app-building-block',
  templateUrl: './building-block.component.html',
  styleUrls: ['./building-block.component.scss']
})
export class BuildingBlockComponent implements OnInit, OnDestroy {
  //@Input() createProject;
  treeData: TreeNode[];
  treeDataNew: TreeNode[];
  subscription: Subscription;
  searchText: string = '';
  selectedNode: TreeNode;
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
  constructor(private projectService: ProjectsService, private appMain: AppMainComponent, private createBuildingBlockservice: CreateBuildingBlockService) {

  }


  ngOnInit() {
    console.log('BuildingBlockComponent: ngOnInit');
    //this.projectService.shareBuildingData(this.createProject);
    this.loadTreeDataNew();
  }
  ngOnDestroy() {
    console.log('BuildingBlockComponent: ngOnDestroy');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadTreeDataNew() {
    this.createBuildingBlockservice.getExplorerData(2).subscribe((data: any) => {
      this.treeDataNew = this.transformData(data.data);
    },
      (error) => {
        console.error('Error loading tree data:', error);
      });
  }

  // Function to filter tree data based on search text
  onSearchChange() {
    if (this.searchText.trim() === '') {
      this.loadTreeDataNew();
    } else {
      this.treeDataNew = this.filterTreeData(this.treeDataNew, this.searchText);
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

  onNodeSelect(event: any): void {
    if (event.node && !event.node.children?.length) {
      this.loading = true;
      this.selectedNode = event.node;
      //   this.onDraftItemClick();
    } else {
      this.selectedNode = null;
    }
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
}
