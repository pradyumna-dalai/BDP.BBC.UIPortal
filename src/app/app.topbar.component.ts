import {Component} from '@angular/core';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="layout-topbar" style="z-index:9000;">
            <div class="layout-topbar-wrapper">
                <div class="layout-topbar-left">
                    <div class="layout-topbar-logo" id="logolink" style="cursor: pointer; outline: none;" routerLink="/">
                        <img id="app-logo"
                             src="assets/layout/images/app-logo.svg"
                             alt="poseidon-layout">
                    </div>
                </div>

                <div class="layout-topbar-right">
                    <a class="menu-button" href="#" (click)="appMain.onMenuButtonClick($event)">
                        <i class="pi pi-bars"></i>
                    </a>

                    <ul class="layout-topbar-actions">
                        
                        <li #profile class="topbar-item user-profile"
                            [ngClass]="{'active-topmenuitem':appMain.activeTopbarItem === profile}">
                            <a href="#">
                                <img class="profile-image" style="border-radius:50%;" src="assets/layout/images/avatar.png" alt="demo">
                                <div class="profile-info" style="margin-top: 5px;">
                                    <h6>Solution User</h6>
                                </div>
                            </a>

                            <ul class="fadeInDown">
                               
                                <li role="menuitem">
                                    <a href="#">
                                        <h6>user Details</h6>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#">
                                        
                                        <h6>Log Out</h6>
                                    </a>
                                </li>
                               
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `
})
export class AppTopBarComponent {

    constructor(public appMain: AppMainComponent, public app: AppComponent) {
    }

}

// (click)="appMain.onTopbarItemClick($event,profile)"