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
import { CategoryComponent } from './demo/master-data/category/category.component';
import { ScopeComponent } from './demo/master-data/scope/scope.component';
import { ProductComponent } from './demo/master-data/product/product.component';
import { UOMComponent } from './demo/master-data/uom/uom.component';
import { FteComponent } from './demo/master-data/fte/fte.component';
import { ProcessConfigComponent } from './demo/master-data/process-config/process-config.component';





@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'project',
                pathMatch: 'full'
            },

            {
                path: '', component: AppMainComponent,
                children: [
                    { path: '', redirectTo: 'project', pathMatch: 'full' },
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
                    { path: 'scope', component: ScopeComponent },
                    { path: 'category', component: CategoryComponent },
                    { path: 'product', component: ProductComponent },
                    { path: 'charge-code', component: ChargeCodeComponent },
                    { path: 'uom', component: UOMComponent },
                    { path: 'fte', component: FteComponent },
                    { path: 'processConfig', component: ProcessConfigComponent }
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
