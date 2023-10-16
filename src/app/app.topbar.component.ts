import {Component} from '@angular/core';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="layout-topbar">
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
                        <li #notifications class="topbar-item notifications"
                            [ngClass]="{'active-topmenuitem':appMain.activeTopbarItem === notifications}">
                            <a href="#" (click)="appMain.onTopbarItemClick($event,notifications)">
                                <span class="p-overlay-badge topbar-icon">
                                    <i class="pi pi-bell" pBadge value="2"></i>
                                </span>
                            </a>
                            <ul class="fadeInDown">
                                <li class="layout-submenu-header">
                                    <h6 class="header-text">Notifications</h6>
                                    <span class="p-badge">3</span>
                                </li>
                                <li role="menuitem">
                                    <a href="#" (click)="appMain.onTopbarSubItemClick($event)">
                                        <i class="pi pi-shopping-cart"></i>
                                        <div class="notifications-item">
                                            <h6>Order <span>#2254</span> is placed</h6>
                                            <span>Total Amount of <span>$34.50</span></span>
                                        </div>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#" (click)="appMain.onTopbarSubItemClick($event)">
                                        <i class="pi pi-clock"></i>
                                        <div class="notifications-item">
                                            <h6>Meeting with <span>AF04</span> Team</h6>
                                            <span>Google Meets</span>
                                        </div>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#" (click)="appMain.onTopbarSubItemClick($event)">
                                        <i class="pi pi-th-large"></i>
                                        <div class="notifications-item">
                                            <h6>Task <span>#41</span> is complete</h6>
                                            <span>9 Remaining Tasks</span>
                                        </div>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#" (click)="appMain.onTopbarSubItemClick($event)">
                                        <i class="pi pi-shopping-cart"></i>
                                        <div class="notifications-item">
                                            <h6>Order <span>#2255</span> is placed</h6>
                                            <span>Total Amount of <span>$40.45</span></span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li #profile class="topbar-item user-profile"
                            [ngClass]="{'active-topmenuitem':appMain.activeTopbarItem === profile}">
                            <a href="#" (click)="appMain.onTopbarItemClick($event,profile)">
                                <img class="profile-image" style="border-radius:50%;" src="assets/layout/images/avatar.png" alt="demo">
                                <div class="profile-info" style="margin-top: 5px;">
                                    <h6>Solution User</h6>
                                </div>
                            </a>

                            <ul class="fadeInDown">
                                <li class="layout-submenu-header">
                                    <img class="profile-image" src="assets/layout/images/avatar.png" alt="demo">
                                    <div class="profile-info">
                                        <h6>Solution User</h6>
                                    </div>
                                </li>
                                <li role="menuitem">
                                    <a href="#" (click)="appMain.onTopbarSubItemClick($event)">
                                        <i class="pi pi-cog"></i>
                                        <h6>Settings</h6>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#" (click)="appMain.onTopbarSubItemClick($event)">
                                        <i class="pi pi-file"></i>
                                        <h6>Terms of Usage</h6>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#" (click)="appMain.onTopbarSubItemClick($event)">
                                        <i class="pi pi-compass"></i>
                                        <h6>Support</h6>
                                    </a>
                                </li>
                                <li role="menuitem">
                                    <a href="#" (click)="appMain.onTopbarSubItemClick($event)">
                                        <i class="pi pi-power-off"></i>
                                        <h6>Logout</h6>
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
