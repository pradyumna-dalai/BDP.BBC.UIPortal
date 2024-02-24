import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardDemoComponent } from './demo/view/dashboarddemo.component';
import { ProjectComponent } from './demo/view/project/project.component';
import { GlossaryComponent } from './demo/view/glossary/glossary.component';
import { CreateBbComponent } from './demo/view/create-bb/create-bb.component';
import { CreateProjectComponent } from './demo/view/project/create-project/create-project.component';
import { LocationsComponent } from './demo/master-data/locations/locations.component';
import { ScopeComponent } from './demo/master-data/scope/scope.component';
import { CategoryComponent } from './demo/master-data/category/category.component';
import { ProductComponent } from './demo/master-data/product/product.component';
import { ChargeCodeComponent } from './demo/master-data/charge-code/charge-code.component';
import { UOMComponent } from './demo/master-data/uom/uom.component';
import { FteComponent } from './demo/master-data/fte/fte.component';
import { ProcessConfigComponent } from './demo/master-data/process-config/process-config.component';


export const routes: Routes = [
    {
        path: '',
        // canActivate: [UserGuardGuard, PasswordGuard, UserSettingsGuard],
        children: [
            { path: '', redirectTo: 'building-block', pathMatch: 'full' },
            { path: 'building-block', component: DashboardDemoComponent },
            { path: 'project', component: ProjectComponent },
            { path: 'glossary', component: GlossaryComponent },
            { path: 'create-buildingblocks', component: CreateBbComponent },
            { path: 'create-buildingblocks/:id', component: CreateBbComponent, },
            { path: 'create-project', component: CreateProjectComponent },
            { path: 'locations', component: LocationsComponent },
            { path: 'scope', component: ScopeComponent },
            { path: 'category', component: CategoryComponent },
            { path: 'product', component: ProductComponent },
            { path: 'charge-code', component: ChargeCodeComponent },
            { path: 'uom', component: UOMComponent },
            { path: 'fte', component: FteComponent },
            { path: 'processConfig', component: ProcessConfigComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppMainRoutingModule { }