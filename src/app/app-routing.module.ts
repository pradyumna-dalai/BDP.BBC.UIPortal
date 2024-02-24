import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { AppNotfoundComponent } from './pages';
import { AuthGuard as Auth0Guard } from '@auth0/auth0-angular';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                component: AppMainComponent,
                children: [
                    {
                        path: '',
                        // canActivate: [Auth0Guard, AuthGuard],
                        loadChildren: () => import('./app-main.module').then(m => m.MainModule),
                    }
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
