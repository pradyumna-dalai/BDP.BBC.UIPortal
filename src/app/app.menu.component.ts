// app-menu.component.ts
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuService } from './app.menu.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    template: `
        <ul class="layout-menu">
            <li *ngFor="let item of menuItems" app-menuitem [item]="item" [index]="item.id" [root]="true" [class.active]="isMenuItemActive(item.routerLink)"></li>
        </ul>
    `
    ,styles: [`
        .active {
            background-color:#4d555e; /* Apply your active state styling here */
            color: #FFFFFF; /* Text color for active state */
            border-radius:7px !important;
         
        }
    `]
})
export class AppMenuComponent implements OnInit {

    menuItems: MenuItem[] = [];

    constructor(private menuService: MenuService,private router: Router) { 
        
    }

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
            case 'location':
                return 'pi pi-fw pi-map-marker'; 
            case 'charge code':
                return 'pi pi-fw pi-code';
            case 'product scope':
                return 'pi pi-fw pi-map'; 
            case 'product name':
                return 'pi pi-fw pi-inbox';
            case 'uom - unit of measure':
                return 'pi pi-arrow-right-arrow-left';
            case 'product category':
                return 'pi pi-bars';
            case 'fte - full time employee':
                return 'pi pi-fw pi-users';
            case 'process configurable':
                return 'pi pi-fw pi-cog';
            case 'cost - item':
                    return 'pi pi-fw pi-desktop';
            default:
                return 'pi pi-fw pi-desktop';
        }
    }

    getRouterLinkForName(name: string, customLink: string): any[] {
        if (customLink) {
            return [customLink];
        }
        switch (name.toLowerCase()) {
            case 'building blocks':
                return ['/building-block'];
            case 'project':
                return ['/project'];
            case 'administration':
                return ['/uikit'];
            case 'master data management':
                return ['/master-data'];
            case 'location':
                return ['/locations'];
            case 'charge code':
                return ['/charge-code'];
            case 'product scope':
                return ['/scope'];
            case 'product category':
                return ['/category'];
            case 'product name':
                return ['/product'];
            case 'uom - unit of measure':
                return ['/uom'];
            case 'fte - full time employee':
                return ['/fte'];
            case 'process configurable':
                return ['/processConfig'];
            case 'cost - item':
                return ['/costItem'];
            default:
                return ['/uikit'];
        }
    }
    isMenuItemActive(routerLink: any[]): boolean {
        // Check if the current route is the same as the provided routerLink
        if (this.router.isActive(this.router.createUrlTree(routerLink), true)) {
            return true;
        }
    
        // Check if the current route is the default route ('/') and the provided routerLink is ['/']
        if (this.router.isActive('', true) && JSON.stringify(routerLink) === JSON.stringify(['/'])) {
            return true;
        }
    
        return false;
    }
    

}
