import {Component, OnInit, OnDestroy} from '@angular/core';
import {AppBreadcrumbService} from '../../app.breadcrumb.service';
import { AppMainComponent } from '../../app.main.component';
import {TreeNode} from 'primeng/api';
import {Subscription} from 'rxjs';
import { CreateBuildingBlockService } from 'src/app/services/create-buildingBlock/create-building-block.service';


@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/demo/badges.scss',
'./dashboard.component.scss']
})
export class DashboardDemoComponent implements OnInit {


   // files1: TreeNode[];
   // selectedFiles1: TreeNode;
   //explorerData: any;
   treeData: TreeNode[];
   treeDataNew: TreeNode[];

    subscription: Subscription;

    constructor(private breadcrumbService: AppBreadcrumbService, private appMain: AppMainComponent, private createBuildingBlockservice:CreateBuildingBlockService) {
        this.breadcrumbService.setItems([
            { label: 'Building Blocks' }
        ]);

       
    }

    ngOnInit() {
        this.loadTreeData();
        this.loadTreeDataNew();
    }

    loadTreeData() {
    this.createBuildingBlockservice.getExplorerData().subscribe((data:any) => {
        this.treeData = this.transformData(data.data);
        console.log('viewData',this.treeData);
      },
      (error) => {
        console.error('Error loading tree data:', error);
      }
    );
  }

  // Optional: You may need to transform the data to TreeNode format
  private transformData(data: any[]): TreeNode[] {
    return data.map((item) => {
      return {
        label: item.name,
        data: item,
        children: this.transformData(item.child || []),
      };
    });
  }

  loadTreeDataNew() {
    this.createBuildingBlockservice.getExplorerDataNew().subscribe((data:any) => {
        this.treeDataNew = this.transformData(data.data);
    //    console.log('viewData',this.treeData);
      },
      (error) => {
        console.error('Error loading tree data:', error);
      }
    );
  }
}

