import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { authenticatedGuard } from './guards/authenticated.guard';
import { UnknownPageComponent } from './unknown-page/unknown-page.component';
import { unauthenticatedGuard } from './guards/unauthenticated.guard';
import { AddVehicleComponent } from './add-asset/add-vehicle/add-vehicle.component';
import { AddStockComponent } from './add-asset/add-stock/add-stock.component';
import { hasAssetGuard } from './guards/has-asset.guard';
import { AssetDetailsPageComponent } from './pages/asset-details-page/asset-details-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { AssetTypePageComponent } from './asset-type-page/asset-type-page.component';

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
    path: 'dashboard/:assetType',
    component: AssetTypePageComponent,
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
    path: 'add/vehicle',
    component: AddVehicleComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'add/stock',
    component: AddStockComponent,
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
