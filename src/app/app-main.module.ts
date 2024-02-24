import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDemoComponent } from './demo/view/dashboarddemo.component';
import { ProjectComponent } from './demo/view/project/project.component';
import { GlossaryComponent } from './demo/view/glossary/glossary.component';
import { CreateBbComponent } from './demo/view/create-bb/create-bb.component';
import { SearchFilterComponent } from './common/search-filter/search-filter.component';
import { CreateProjectComponent } from './demo/view/project/create-project/create-project.component';
import { ChargeCodeComponent } from './demo/master-data/charge-code/charge-code.component';
import { LocationsComponent } from './demo/master-data/locations/locations.component';
import { ScopeComponent } from './demo/master-data/scope/scope.component';
import { CategoryComponent } from './demo/master-data/category/category.component';
import { ProductComponent } from './demo/master-data/product/product.component';
import { UOMComponent } from './demo/master-data/uom/uom.component';
import { FteComponent } from './demo/master-data/fte/fte.component';
import { ProcessConfigComponent } from './demo/master-data/process-config/process-config.component';
import { BuildingBlockComponent } from './demo/view/project/create-project/building-block/building-block.component';
import { AddVolumeComponent } from './demo/view/project/create-project/add-volume/add-volume.component';
import { CostLineItemComponent } from './demo/view/project/create-project/cost-line-item/cost-line-item.component';
import { OtherCostComponent } from './demo/view/project/create-project/other-cost/other-cost.component';
import { ProjectCostComponent } from './demo/view/project/create-project/project-cost/project-cost.component';
import { AppMainRoutingModule } from './app-main-routing.module';
import { PrimengModule } from './modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';


@NgModule({
    declarations: [
        DashboardDemoComponent,
        ProjectComponent,
        GlossaryComponent,
        CreateBbComponent,
        SearchFilterComponent,
        CreateProjectComponent,
        ChargeCodeComponent,
        LocationsComponent,
        ScopeComponent,
        CategoryComponent,
        ProductComponent,
        UOMComponent,
        FteComponent,
        ProcessConfigComponent,
        BuildingBlockComponent,
        AddVolumeComponent,
        CostLineItemComponent,
        OtherCostComponent,
        ProjectCostComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppMainRoutingModule,
        PrimengModule,
        NgxDaterangepickerMd.forRoot(),
    ],
    exports: []
})
export class MainModule {
    constructor() {
    }
}
