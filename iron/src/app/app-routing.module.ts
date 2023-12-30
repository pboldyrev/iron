import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authenticatedGuard } from './guards/authenticated.guard';
import { UnknownPageComponent } from './unknown-page/unknown-page.component';
import { unauthenticatedGuard } from './guards/unauthenticated.guard';
import { AddAssetPageComponent } from './pages/add-asset-page/add-asset-page.component';
import { hasAssetGuard } from './guards/has-asset.guard';
import { AssetDetailsPageComponent } from './pages/asset-details-page/asset-details-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'asset/:id',
    component: AssetDetailsPageComponent,
    canActivate: [authenticatedGuard, hasAssetGuard],
  },
  {
    path: 'add/:assetType',
    component: AddAssetPageComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [unauthenticatedGuard],
  },
  {
    path: '**',
    component: UnknownPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
