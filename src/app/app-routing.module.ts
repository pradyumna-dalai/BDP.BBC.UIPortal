import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardDemoComponent } from './demo/view/dashboarddemo.component';
import { AppMainComponent } from './app.main.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { ProjectComponent } from './demo/view/project/project.component';
import { GlossaryComponent } from './demo/view/glossary/glossary.component';
import { CreateBbComponent } from './demo/view/create-bb/create-bb.component';
import { GeneralInfoComponent } from './demo/view/create-bb/general-info.component';
import { CommercialRefComponent } from './demo/view/create-bb/commercial-ref.component';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'building-block',
                pathMatch: 'full'
            },
            {
                path: '', component: AppMainComponent,
                children: [
                    { path: '', component: DashboardDemoComponent },
                    { path: 'project', component: ProjectComponent },
                    { path: 'glossary', component: GlossaryComponent },
                    { path: 'create-buildingblocks', component: CreateBbComponent },
                    { path: 'building-block', component: DashboardDemoComponent },
                ]
            },
            { path: 'notfound', component: AppNotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
