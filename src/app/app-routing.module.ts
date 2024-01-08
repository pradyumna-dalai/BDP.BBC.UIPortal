import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardDemoComponent } from './demo/view/dashboarddemo.component';
import { AppMainComponent } from './app.main.component';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { ProjectComponent } from './demo/view/project/project.component';
import { GlossaryComponent } from './demo/view/glossary/glossary.component';
import { CreateBbComponent } from './demo/view/create-bb/create-bb.component';
import { CreateProjectComponent } from './demo/view/project/create-project/create-project.component';
import { LocationsComponent } from './demo/master-data/locations/locations.component';
import { ChargeCodeComponent } from './demo/master-data/charge-code/charge-code.component';





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
                    { path: '', redirectTo: 'building-block', pathMatch: 'full' },
                    { path: 'project', component: ProjectComponent },
                    { path: 'glossary', component: GlossaryComponent },
                    { path: 'create-buildingblocks', component: CreateBbComponent },
                    {
                        path: 'create-buildingblocks/:id',
                        component: CreateBbComponent,
                    },

                    { path: 'building-block', component: DashboardDemoComponent },
                    { path: 'create-project', component: CreateProjectComponent } 
                ]
            },
            {
                path: '', component: AppMainComponent,
                children: [
                    { path: '', redirectTo: 'building-block', pathMatch: 'full' },
                    { path: 'locations', component: LocationsComponent },
                    { path: 'charge-code', component: ChargeCodeComponent }
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
