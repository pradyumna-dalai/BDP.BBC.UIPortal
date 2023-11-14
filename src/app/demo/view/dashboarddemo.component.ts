import {Component, OnInit, OnDestroy} from '@angular/core';
import {AppBreadcrumbService} from '../../app.breadcrumb.service';
import { AppMainComponent } from '../../app.main.component';
import {Subscription} from 'rxjs';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../../assets/demo/badges.scss',
'./dashboard.component.scss']
})
export class DashboardDemoComponent implements OnInit {




    subscription: Subscription;

    constructor(private breadcrumbService: AppBreadcrumbService, private appMain: AppMainComponent) {
        this.breadcrumbService.setItems([
            { label: 'Building Blocks' }
        ]);

       
    }

    ngOnInit() {
       
    }

   
}
