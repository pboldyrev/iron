import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { DataService } from '../shared/services/data.service';

export const hasAssetGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const dataService = inject(DataService);
  const router = inject(Router);
  const assetId = route.params['id'] ?? "";

  return !!dataService.getAssetById$(assetId);
};
