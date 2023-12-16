import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { authenticatedGuard } from './guards/authenticated.guard';
import { UnknownPageComponent } from './unknown-page/unknown-page.component';
import { SignupComponent } from './signup/signup.component';
import { unauthenticatedGuard } from './guards/unauthenticated.guard';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { AddStockComponent } from './add-stock/add-stock.component';
import { AddCdComponent } from './add-cd/add-cd.component';
import { AddHysaComponent } from './add-hysa/add-hysa.component';
import { AddCustomComponent } from './add-custom/add-custom.component';
import { ValueHistoryComponent } from './value-history/value-history.component';
import { hasAssetGuard } from './guards/has-asset.guard';
import { ValueHistoryPageComponent } from './value-history-page/value-history-page.component';
import { AssetDetailsPageComponent } from './asset-details-page/asset-details-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'overview',
    component: OverviewComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'asset/:id/value-history',
    component: ValueHistoryPageComponent,
    canActivate: [authenticatedGuard, hasAssetGuard],
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
    path: 'add/cd',
    component: AddCdComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'add/hysa',
    component: AddHysaComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'add/custom',
    component: AddCustomComponent,
    canActivate: [authenticatedGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [unauthenticatedGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
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
