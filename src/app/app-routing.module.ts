import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardDemoComponent} from './demo/view/dashboarddemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';
import {AppMainComponent} from './app.main.component';
import {AppNotfoundComponent} from './pages/app.notfound.component';
import { ProjectComponent } from './demo/view/project/project.component';
import {TemplateComponent } from './demo/view/template/template.component';
import { GlossaryComponent } from './demo/view/glossary/glossary.component';
import { CreateTemplateComponent } from './demo/view/template/create-template/create-template.component';
import { CreateBbComponent } from './demo/view/create-bb/create-bb.component';
import { GeneralInfoComponent } from './demo/view/create-bb/general-info.component';
import { CommercialRefComponent } from './demo/view/create-bb/commercial-ref.component';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {path: '', component: DashboardDemoComponent},
                    {path: 'pages/empty', component: EmptyDemoComponent},
                    {path: 'documentation', component: DocumentationComponent},
                    {path: 'project', component: ProjectComponent},
                    {path: 'template', component: TemplateComponent},
                    {path: 'create-template', component: CreateTemplateComponent},
                    {path: 'glossary', component: GlossaryComponent},
                    {path: 'create-buildingblocks', component: CreateBbComponent},
                    // {path:'', redirectTo: 'create-buildingblocks/general-info', pathMatch: 'full'},
                    // {path: 'create-buildingblocks/general-info', component: GeneralInfoComponent},
                    // {path: 'create-buildingblocks/commercial-ref', component: CommercialRefComponent},
                    {path:'',component: CreateBbComponent, children:[
                        {path:'', redirectTo: 'create-buildingblocks/general-info', pathMatch: 'full'},
                        {path: 'create-buildingblocks/general-info', component: GeneralInfoComponent},
                        {path: 'create-buildingblocks/commercial-ref', component: CommercialRefComponent}
                ]}

                    
                ]
            },

            {path: 'notfound', component: AppNotfoundComponent},
            {path: '**', redirectTo: '/notfound'},
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
