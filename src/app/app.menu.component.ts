// app-menu.component.ts
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuService } from './app.menu.service';

@Component({
    selector: 'app-menu',
    template: `
        <ul class="layout-menu">
            <li *ngFor="let item of menuItems" app-menuitem [item]="item" [index]="item.id" [root]="true"></li>
        </ul>
    `
})
export class AppMenuComponent implements OnInit {

    menuItems: MenuItem[] = [];

    constructor(private menuService: MenuService) { }

    ngOnInit() {
        this.menuService.getMenuItems().subscribe(apiMenuItems => {
            this.menuItems = this.convertToMenuItems(apiMenuItems.data);
        });
    }

    convertToMenuItems(apiItems: any[]): MenuItem[] {
        return apiItems.map(item => {
            const menuItem: MenuItem = {
                label: item.name,
                icon: this.getIconForName(item.name),
                routerLink: this.getRouterLinkForName(item.name, item.redirectUrl)
            };

            if (item.subMenu && item.subMenu.length > 0) {
                menuItem.items = this.convertToMenuItems(item.subMenu);
            }

            return menuItem;
        });
    }


    getIconForName(name: string): string {
        switch (name.toLowerCase()) {
            case 'building blocks':
                return 'pi pi-fw pi-sitemap';
            case 'project':
                return 'pi pi-fw pi-file';
            case 'administration':
                return 'pi pi-fw pi-cog';
            case 'master data management':
                return 'pi pi-fw pi-database';
            case 'locations':
                return 'pi pi-fw pi-file';
            default:
                return 'pi pi-fw pi-desktop'; // Default icon if not matched
        }
    }

    getRouterLinkForName(name: string, customLink: string): any[] {
        if (customLink) {
            return [customLink];
        }
        switch (name.toLowerCase()) {
            case 'building blocks':
                return ['/'];
            case 'project':
                return ['/project'];
            case 'administration':
                return ['/uikit'];
            case 'master data management':
                return ['/master-data'];
            case 'locations':
                return ['/locations'];
            default:
                return ['/uikit'];
        }
    }

}
