import {Component, OnInit } from '@angular/core';
import {AppBreadcrumbService} from '../../app.breadcrumb.service';
import { AppMainComponent } from '../../app.main.component';
import { TreeNode } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';
import { Accordion } from 'primeng/accordion';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/demo/badges.scss', './dashboard.component.scss']
})
export class DashboardDemoComponent implements OnInit {

 
  showScopingCrad: boolean = true;
  showCommercialCrad: boolean = false;
  showOperationCrad: boolean = false;
  private _isExpanded = false;
   treeData: TreeNode[];
   treeDataNew: TreeNode[];

    subscription: Subscription;
    searchText: string = ''; 

    constructor(private breadcrumbService: AppBreadcrumbService, private appMain: AppMainComponent, private createBuildingBlockservice: CreateBuildingBlockService) {
        this.breadcrumbService.setItems([
            { label: 'Building Blocks' }
        ]);
    }

    ngOnInit() {
  
        this.loadTreeData();
        this.loadTreeDataNew();
    }

    loadTreeData() {
        this.createBuildingBlockservice.getExplorerData().subscribe((data: any) => {
            this.treeData = this.transformData(data.data);
            console.log('viewData', this.treeData);
        },
            (error) => {
                console.error('Error loading tree data:', error);
            }
        );
    }

    loadTreeDataNew() {
        this.createBuildingBlockservice.getExplorerDataNew().subscribe((data: any) => {
            this.treeDataNew = this.transformData(data.data);
        },
            (error) => {
                console.error('Error loading tree data:', error);
            }
        );
    }

    // Function to filter tree data based on search text
    onSearchChange() {
      if (this.searchText.trim() === '') {
        // If search text is empty, reload the original data
        this.loadTreeData();
        this.loadTreeDataNew();
    } else {
        this.treeData = this.filterTreeData(this.treeData, this.searchText);
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
        return data.filter(node => node.label.toLowerCase().includes(searchText.toLowerCase()));
    }

    onCardClick(val) {
        if (val == 'scoping') {
          this.showScopingCrad = true;
          this.showOperationCrad = false;
          this.showCommercialCrad = false;
        }
        if (val == 'operation') {
          this.showScopingCrad = false;
          this.showOperationCrad = true;
          this.showCommercialCrad = false;
    
        }
        if (val == 'commercial') {
          this.showScopingCrad = false;
          this.showOperationCrad = false;
          this.showCommercialCrad = true;
    
        }
    
      }
      public get isExpanded() {
        return this._isExpanded;
      }
    
      public set isExpanded(value: boolean) {
         this._isExpanded = value;
      }
     
}

 




