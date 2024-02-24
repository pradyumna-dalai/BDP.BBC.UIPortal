import { NgModule } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ApiErrorInterceptor, ApiRequestInterceptor } from '../app/common/index';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { AppBreadcrumbComponent } from './app.breadcrumb.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { MenuService } from './app.menu.service';
import { AppBreadcrumbService } from './app.breadcrumb.service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgHttpLoaderModule } from 'ng-http-loader';
/** Auth0 */
import { AuthModule, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { PrimengModule } from './modules';
import { AccessErrorComponent, AppAccessdeniedComponent, AppEndUserLicenseAgreementComponent, AppErrorComponent, AppNotfoundComponent, Auth0ErrorComponent, MaintenanceComponent } from './pages';
import { LoadingComponent } from './pages/loading/loading.component';

@NgModule({
    imports: [
        BrowserModule,
        EditorModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        DatePipe,
        NgHttpLoaderModule.forRoot(),
        PrimengModule,
        /** Auth0 */
        AuthModule.forRoot({
            ...environment.auth0,
            httpInterceptor: {
                ...environment.httpInterceptor,
            },
        }),
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppBreadcrumbComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppNotfoundComponent,
        AppAccessdeniedComponent,
        AppErrorComponent,
        AppEndUserLicenseAgreementComponent,
        MaintenanceComponent,
        LoadingComponent,
        Auth0ErrorComponent,
        AccessErrorComponent,
    ],
    providers: [
        MenuService, AppBreadcrumbService, DatePipe,
        /** Auth0 */
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHttpInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiRequestInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiErrorInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent],
    exports: [PrimengModule]
})
export class AppModule {
}
