import { Component, OnInit } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
    selector: 'app-menu',
    template: `
        <ul class="layout-menu">
            <li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
        </ul>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];
    model1: any[];
    new: any;

    constructor(public app: AppComponent) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Building Blocks', icon: 'pi pi-fw pi-sitemap', routerLink: ['/'],
            },
            {
                label: 'Project', icon: 'pi pi-fw pi-file', routerLink: ['/project'],
            },
            // {
            //     label: 'Glossary', icon: 'pi pi-fw pi-desktop', routerLink: ['/glossary'],
            // },

            {
                label: 'Adminstration', icon: 'pi pi-fw pi-cog', routerLink: ['/uikit'],
                items: [
                    { label: 'Adminstration 1', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Adminstration 2', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], preventExact: true },
                    { label: 'Adminstration 3', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                ]
            },
            {
                label: 'Master Data Management', icon: 'pi pi-fw pi-database', routerLink: ['/uikit'],
                items: [
                    { label: 'Master Data 1', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Master Data 2', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], preventExact: true },
                    { label: 'Master Data 3', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                ]
            }
        ];

        this.model1 = [
            {
                "id": 1,
                "name": "Building Block",
                "description": "Describe the menu options, which can be viewed in tooltip",
                "parent_id": null,
                "redirect_url": null,
                "sub_menu":
                    [
                        {
                            "id": 2,
                            "name": "Building Block",
                            "description": "Describe the menu options, which can be viewed in tooltip",
                            "parent_id": 1,
                            "redirect_url": null,
                            "sub_menu": false
                        },
                        {
                            "id": 3,
                            "name": "Building Block",
                            "description": "Describe the menu options, which can be viewed in tooltip",
                            "parent_id": 1,
                            "redirect_url": null,
                            "sub_menu": false
                        },
                        {
                            "id": 2,
                            "name": "Building Block",
                            "description": "Describe the menu options, which can be viewed in tooltip",
                            "parent_id": 1,
                            "redirect_url": null,
                            "sub_menu": false
                        },
                        {
                            "id": 3,
                            "name": "Building Block",
                            "description": "Describe the menu options, which can be viewed in tooltip",
                            "parent_id": 1,
                            "redirect_url": null,
                            "sub_menu": false
                        }
                    ]
            }
        ]

    }
}
