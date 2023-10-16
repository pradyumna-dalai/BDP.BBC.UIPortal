import {Component} from '@angular/core';
import {AppComponent} from './app.component';

@Component({
    selector: 'app-footer',
    template: `
        <div class="layout-footer">
            <div class="col-12 md:col-3 bdp-align-left">
                End User License Agreement <a target="blank" [routerLink]="['/end-user-license-agreement']">(EULA)</a>
            </div>
            <div class="col-12 md:col-3 bdp-align-center" style="text-align: center;">

                <span style="margin-left: 1rem;" id="time"><h6></h6></span>
            </div>
            <div class="col-12 md:col-6 bdp-align-right" style="display: flex;
            justify-content: flex-end;">
                <!-- Copyright &#169; 2023 BDP International, Inc -->
                &#169; 2023 PSA International Pte. Ltd. | &#169; 2023 BDP International Inc. | All rights reserved
            </div>
        </div>
    `
})
export class AppFooterComponent {

    constructor(public app: AppComponent) {}


}
