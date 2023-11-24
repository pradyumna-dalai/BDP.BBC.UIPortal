import {Component, OnInit, OnDestroy} from '@angular/core';
import {AppBreadcrumbService} from '../../app.breadcrumb.service';
import { AppMainComponent } from '../../app.main.component';
import {TreeNode} from 'primeng/api';
import {Subscription} from 'rxjs';
import { Inject } from '@angular/core';
import { NodeService } from 'src/service/nodeservice';



@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/demo/badges.scss',
'./dashboard.component.scss']
})
export class DashboardDemoComponent implements OnInit {


    files: TreeNode[];
    selectedFiles: TreeNode;
    subscription: Subscription;

    constructor(private breadcrumbService: AppBreadcrumbService, private appMain: AppMainComponent,@Inject(NodeService) private nodeService: NodeService) {
        this.breadcrumbService.setItems([
            { label: 'Building Blocks' }
        ]);

       
    }

    ngOnInit() {
        this.nodeService.getFiles().then((data: TreeNode<any>[]) => (this.files = data));
    }

   
}
