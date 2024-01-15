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
    // ,styles: [`
    //     .active {
    //         background-color: #007bff; /* Apply your active state styling here */
    //         color: #fff; /* Text color for active state */
    //     }
    // `]
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
            case 'locations':
                return 'pi pi-fw pi-file';
            case 'charge code':
                return 'pi pi-fw pi-file';
            case 'scope':
                return 'pi pi-fw pi-file';
            case 'product':
                return 'pi pi-fw pi-file';
            case 'uom':
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
                return ['/building-block'];
            case 'project':
                return ['/project'];
            case 'administration':
                return ['/uikit'];
            case 'master data management':
                return ['/master-data'];
            case 'locations':
                return ['/locations'];
            case 'charge code':
                return ['/charge-code'];
            case 'scope':
                return ['/scope'];
            case 'category':
                return ['/category'];
            case 'product':
                return ['/product'];
            case 'uom':
                return ['/uom'];
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
